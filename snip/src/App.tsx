import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CreditCard, MapPin, PoundSterling, Search, Scissors, Settings2, Star, UserRound, UsersRound, X } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { Drawer } from 'vaul'

type View = 'discover' | 'book' | 'bookings' | 'admin'
type BookingStatus = 'confirmed' | 'completed' | 'cancelled'
type Staff = { id: string; name: string; role: string; initials: string; colour: string; workingDays: number[]; start: string; end: string; slotMinutes: number }
type Service = { id: string; name: string; duration: number; price: number }
type Booking = { id: string; shopId: string; customer: string; email: string; serviceId: string; staffId: string; date: string; time: string; status: BookingStatus }
type Shop = {
  id: string
  name: string
  town: 'Brighton' | 'Burgess Hill'
  address: string
  postcode: string
  latitude: number
  longitude: number
  rating: number
  reviewCount: number
  priceFrom: number
  nextAvailable: string
  images: { src: string; alt: string }[]
  services: Service[]
}

const assetPath = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const SERVICES: Service[] = [
  { id: 'cut', name: "Men's haircut", duration: 30, price: 24 },
  { id: 'skin', name: 'Skin fade', duration: 45, price: 29 },
  { id: 'beard', name: 'Beard trim', duration: 20, price: 16 },
  { id: 'cut-beard', name: 'Haircut and beard', duration: 50, price: 36 },
]

const INITIAL_STAFF: Staff[] = [
  { id: 'alex', name: 'Alex Morgan', role: 'Senior barber', initials: 'AM', colour: '#d6eee2', workingDays: [1, 2, 3, 4, 5], start: '09:00', end: '17:30', slotMinutes: 30 },
  { id: 'sam', name: 'Sam Taylor', role: 'Barber', initials: 'ST', colour: '#f1dfc7', workingDays: [2, 3, 4, 5, 6], start: '10:00', end: '18:00', slotMinutes: 30 },
]

const SHOPS: Shop[] = [
  {
    id: 'north-laine',
    name: 'North Laine Barber Co.',
    town: 'Brighton',
    address: '18 Gardner Street, Brighton',
    postcode: 'BN1 1UP',
    latitude: 50.8249,
    longitude: -0.1391,
    rating: 4.9,
    reviewCount: 127,
    priceFrom: 16,
    nextAvailable: 'Today, 11:30',
    images: [
      { src: assetPath('/shops/north-laine-main.webp'), alt: 'A barber giving a haircut inside the warm, modern North Laine Barber Co.' },
      { src: assetPath('/hero/barber-hero-2.webp'), alt: 'A barber at work inside North Laine Barber Co.' },
      { src: assetPath('/hero/barber-hero-3.webp'), alt: 'The North Laine Barber Co. team at work.' },
      { src: assetPath('/hero/barber-hero-4.webp'), alt: 'Barbers working at North Laine Barber Co.' },
    ],
    services: SERVICES,
  },
  {
    id: 'the-gentlemans-room',
    name: "The Gentleman's Room",
    town: 'Burgess Hill',
    address: '42 Church Road, Burgess Hill',
    postcode: 'RH15 9AE',
    latitude: 50.9566,
    longitude: -0.1328,
    rating: 4.8,
    reviewCount: 94,
    priceFrom: 15,
    nextAvailable: 'Today, 13:00',
    images: [
      { src: assetPath('/shops/gentlemans-room-main.webp'), alt: "The green shopfront of The Gentleman's Room in Burgess Hill." },
      { src: assetPath('/hero/barber-hero-1.webp'), alt: "The team at The Gentleman's Room." },
      { src: assetPath('/hero/barber-hero-4.webp'), alt: "Inside The Gentleman's Room in Burgess Hill." },
      { src: assetPath('/hero/barber-hero-2.webp'), alt: "A barber working at The Gentleman's Room." },
    ],
    services: SERVICES.map(service => ({ ...service, price: Math.max(15, service.price - 2) })),
  },
  {
    id: 'seven-dials',
    name: 'Seven Dials Barbers',
    town: 'Brighton',
    address: '91 Dyke Road, Brighton',
    postcode: 'BN1 3JE',
    latitude: 50.8314,
    longitude: -0.1474,
    rating: 4.7,
    reviewCount: 81,
    priceFrom: 18,
    nextAvailable: 'Tomorrow, 09:30',
    images: [
      { src: assetPath('/shops/seven-dials-main.webp'), alt: 'The blue corner shopfront of Seven Dials Barbers in Brighton.' },
      { src: assetPath('/hero/barber-hero-2.webp'), alt: 'A haircut at Seven Dials Barbers.' },
      { src: assetPath('/hero/barber-hero-1.webp'), alt: 'The Seven Dials Barbers team.' },
      { src: assetPath('/hero/barber-hero-3.webp'), alt: 'Inside Seven Dials Barbers.' },
    ],
    services: SERVICES.map(service => ({ ...service, price: service.price + 2 })),
  },
  {
    id: 'junction-barbers',
    name: 'Junction Barbers',
    town: 'Burgess Hill',
    address: '6 Station Road, Burgess Hill',
    postcode: 'RH15 9DQ',
    latitude: 50.9532,
    longitude: -0.1277,
    rating: 4.9,
    reviewCount: 63,
    priceFrom: 17,
    nextAvailable: 'Today, 15:30',
    images: [
      { src: assetPath('/shops/junction-main.webp'), alt: 'A beard trim inside the cool, contemporary Junction Barbers.' },
      { src: assetPath('/hero/barber-hero-4.webp'), alt: 'Inside Junction Barbers.' },
      { src: assetPath('/hero/barber-hero-3.webp'), alt: 'The Junction Barbers team at work.' },
      { src: assetPath('/hero/barber-hero-1.webp'), alt: 'A haircut at Junction Barbers.' },
    ],
    services: SERVICES.map(service => ({ ...service, price: service.price + 1 })),
  },
]

const seedBookings: Booking[] = [
  { id: 'demo-1', shopId: 'north-laine', customer: 'Jamie Collins', email: 'jamie@example.com', serviceId: 'cut', staffId: 'alex', date: todayISO(1), time: '10:00', status: 'confirmed' },
  { id: 'demo-2', shopId: 'north-laine', customer: 'Ravi Patel', email: 'ravi@example.com', serviceId: 'skin', staffId: 'sam', date: todayISO(1), time: '12:30', status: 'confirmed' },
]

const BOOKING_STEPS = ['service', 'appointment', 'details'] as const

const REVIEWS = [
  { name: 'Jamie R.', date: '18 July 2026', text: 'Great cut and a genuinely relaxed atmosphere. Alex took the time to understand exactly what I wanted.' },
  { name: 'Tom H.', date: '12 July 2026', text: 'Best fade I’ve had in Brighton. Easy booking, friendly team and no waiting around.' },
  { name: 'Marcus L.', date: '4 July 2026', text: 'Sam was brilliant. Precise, quick and gave useful advice without overcomplicating it.' },
  { name: 'Daniel P.', date: '28 June 2026', text: 'A proper independent barber shop. Welcoming, skilled and consistently good.' },
  { name: 'Owen C.', date: '19 June 2026', text: 'Booked the same morning and walked out very happy. I’ll definitely be back.' },
  { name: 'Ravi S.', date: '10 June 2026', text: 'Excellent beard trim and attention to detail. The whole experience felt considered.' },
  { name: 'Chris M.', date: '2 June 2026', text: 'Friendly people, great music and a really clean cut. Highly recommended.' },
  { name: 'Ben A.', date: '24 May 2026', text: 'Consistently excellent. I’ve tried a lot of barbers in Brighton and this is the one I return to.' },
]

function todayISO(offset = 0) {
  const date = new Date(); date.setDate(date.getDate() + offset)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(value: string, short = false) {
  return new Intl.DateTimeFormat('en-GB', { weekday: short ? 'short' : 'long', day: 'numeric', month: short ? 'short' : 'long' }).format(new Date(`${value}T12:00:00`))
}

function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(':').map(Number); const total = h * 60 + m + minutes
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

function isPastSlot(date: string, time: string) {
  if (date !== todayISO()) return false
  const now = new Date()
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes <= now.getHours() * 60 + now.getMinutes()
}

function monthISO(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function calendarDates(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(month.getFullYear(), month.getMonth(), index - offset + 1)
    const year = day.getFullYear(); const monthNumber = String(day.getMonth() + 1).padStart(2, '0'); const date = String(day.getDate()).padStart(2, '0')
    return { iso: `${year}-${monthNumber}-${date}`, day: day.getDate(), currentMonth: day.getMonth() === month.getMonth() }
  })
}

function distanceMiles(latitude: number, longitude: number, shop: Shop) {
  const radius = 3958.8
  const toRadians = (value: number) => value * Math.PI / 180
  const latitudeDelta = toRadians(shop.latitude - latitude)
  const longitudeDelta = toRadians(shop.longitude - longitude)
  const startLatitude = toRadians(latitude)
  const endLatitude = toRadians(shop.latitude)
  const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function StaffPhoto({ id, name }: { id: string; name: string }) {
  return <img className="staff-photo" src={assetPath(`/staff/${id}.webp`)} width="44" height="44" alt="" aria-hidden="true" />
}

function App() {
  const [view, setView] = useState<View>('discover')
  const [selectedShopId, setSelectedShopId] = useState('north-laine')
  const [staff, setStaff] = useState<Staff[]>(() => typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('chairly-staff') || 'null') || INITIAL_STAFF) : INITIAL_STAFF)
  const [bookings, setBookings] = useState<Booking[]>(() => typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('chairly-bookings') || 'null') || seedBookings) : seedBookings)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [leaveBookingOpen, setLeaveBookingOpen] = useState(false)
  const bookingDirtyRef = useRef(false)
  const allowBookingExitRef = useRef(false)
  const selectedShop = SHOPS.find(shop => shop.id === selectedShopId) || SHOPS[0]

  useEffect(() => localStorage.setItem('chairly-staff', JSON.stringify(staff)), [staff])
  useEffect(() => localStorage.setItem('chairly-bookings', JSON.stringify(bookings)), [bookings])
  useEffect(() => { window.scrollTo(0, 0) }, [view])

  const openShop = (shopId: string, transitionSource?: HTMLElement | null) => {
    const updateView = () => {
      setSelectedShopId(shopId)
      setEditingId(null)
      setView('book')
      const url = new URL(window.location.href)
      url.search = ''
      url.searchParams.set('barber', shopId)
      window.history.pushState({ view: 'book', shopId }, '', `${url.pathname}${url.search}`)
    }
    const startViewTransition = (document as Document & { startViewTransition?: (update: () => void) => void }).startViewTransition
    if (startViewTransition) {
      if (transitionSource) transitionSource.style.viewTransitionName = 'shop-hero'
      startViewTransition.call(document, () => flushSync(updateView))
    }
    else updateView()
  }
  const goHome = () => {
    bookingDirtyRef.current = false
    setEditingId(null)
    setView('discover')
    window.history.pushState({ view: 'discover' }, '', window.location.pathname)
  }
  const saveBooking = (booking: Booking) => {
    const isUpdate = Boolean(editingId)
    bookingDirtyRef.current = false
    setBookings(current => current.some(item => item.id === booking.id) ? current.map(item => item.id === booking.id ? booking : item) : [...current, booking])
    setEditingId(null); setView('bookings')
    toast.success(isUpdate ? 'Booking updated' : 'Booking confirmed')
  }
  const changeBooking = (booking: Booking) => {
    setBookings(current => current.map(item => item.id === booking.id ? booking : item))
    toast.success('Booking updated')
  }
  const cancelBooking = (id: string) => setBookings(current => current.map(item => item.id === id ? { ...item, status: 'cancelled' } : item))

  useEffect(() => {
    const requestedShop = new URL(window.location.href).searchParams.get('barber')
    if (requestedShop && SHOPS.some(shop => shop.id === requestedShop)) {
      setSelectedShopId(requestedShop)
      setView('book')
    }
    const handlePopState = () => {
      const url = new URL(window.location.href)
      const shopId = url.searchParams.get('barber')
      if (!shopId && bookingDirtyRef.current && !allowBookingExitRef.current) {
        window.history.forward()
        setLeaveBookingOpen(true)
        return
      }
      if (allowBookingExitRef.current) {
        allowBookingExitRef.current = false
        bookingDirtyRef.current = false
      }
      if (shopId && SHOPS.some(shop => shop.id === shopId)) {
        setSelectedShopId(shopId)
        setView('book')
      } else {
        setView('discover')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand" onClick={goHome} aria-label="Snip home"><span className="barber-mark"><Scissors size={17}/></span>SNIP</button>
        <nav aria-label="Main navigation">
          <button className={view === 'bookings' ? 'active' : ''} onClick={() => setView('bookings')}>My bookings</button>
          <button className={view === 'admin' ? 'active' : ''} onClick={() => setView('admin')}><Settings2 size={16}/>Admin</button>
        </nav>
      </div>
    </header>
    <main id="main-content">
      {view === 'discover' && <DiscoverHome shops={SHOPS} onSelect={openShop}/>}
      {view === 'book' && <BookingFlow shop={selectedShop} staff={staff} bookings={bookings} editing={bookings.find(b => b.id === editingId)} onSave={saveBooking} onDirtyChange={dirty => { bookingDirtyRef.current = dirty }} onExit={() => { bookingDirtyRef.current = false; setEditingId(null); setView('bookings') }}/>}
      {view === 'bookings' && <MyBookings bookings={bookings} shops={SHOPS} staff={staff} onChange={changeBooking} onCancel={cancelBooking}/>}
      {view === 'admin' && <Admin shop={selectedShop} staff={staff} setStaff={setStaff} bookings={bookings.filter(booking => (booking.shopId || 'north-laine') === selectedShop.id)} setBookings={setBookings}/>}
    </main>
    {leaveBookingOpen && <LeaveBookingDrawer onStay={() => setLeaveBookingOpen(false)} onLeave={() => {
      allowBookingExitRef.current = true
      setLeaveBookingOpen(false)
      window.history.back()
    }}/>} 
    <Toaster
      position="bottom-center"
      offset={{ bottom: 24 }}
      mobileOffset={{ bottom: view === 'book' ? 'calc(92px + env(safe-area-inset-bottom))' : 'calc(14px + env(safe-area-inset-bottom))', left: 14, right: 14 }}
      toastOptions={{ className: 'snip-toast' }}
    />
  </div>
}

function DiscoverHome({ shops, onSelect }: { shops: Shop[]; onSelect: (shopId: string, transitionSource?: HTMLElement | null) => void }) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationSource, setLocationSource] = useState<'loading' | 'approximate' | 'precise' | 'unavailable'>('loading')
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'denied' | 'unavailable'>('idle')
  const [locationPermission, setLocationPermission] = useState<PermissionState | 'checking'>('checking')

  useEffect(() => {
    setLocation({ latitude: 50.8225, longitude: -0.1372 })
    setLocationSource('approximate')
  }, [])

  const requestLocation = (showSuccessToast = false) => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable')
      return
    }
    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      position => {
        const preciseLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude }
        setLocation(preciseLocation)
        setLocationSource('precise')
        setLocationStatus('idle')
        if (showSuccessToast) {
          const nearestShop = [...shops].sort((a, b) =>
            distanceMiles(preciseLocation.latitude, preciseLocation.longitude, a) - distanceMiles(preciseLocation.latitude, preciseLocation.longitude, b)
          )[0]
          const nearestDistance = nearestShop ? distanceMiles(preciseLocation.latitude, preciseLocation.longitude, nearestShop) : null
          toast.success('Precise location found', {
            description: nearestShop && nearestDistance !== null && nearestDistance <= 10
              ? `You appear to be near ${nearestShop.town}.`
              : 'Showing the closest barbers to you.',
          })
        }
      },
      error => setLocationStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  }

  useEffect(() => {
    if (!navigator.permissions) {
      setLocationPermission('prompt')
      return
    }

    let permission: PermissionStatus | undefined
    const updatePermission = () => {
      if (!permission) return
      setLocationPermission(permission.state)
      if (permission.state === 'denied') setLocationStatus('denied')
      if (permission.state === 'granted') requestLocation()
    }

    navigator.permissions.query({ name: 'geolocation' })
      .then(result => {
        permission = result
        updatePermission()
        permission.addEventListener('change', updatePermission)
      })
      .catch(() => setLocationPermission('prompt'))

    return () => permission?.removeEventListener('change', updatePermission)
  }, [])

  const results = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase()
    return shops
      .filter(shop => !normalisedQuery || `${shop.name} ${shop.town} ${shop.postcode}`.toLowerCase().includes(normalisedQuery))
      .map(shop => ({ shop, distance: location ? distanceMiles(location.latitude, location.longitude, shop) : null }))
      .sort((a, b) => a.distance !== null && b.distance !== null ? a.distance - b.distance : b.shop.rating - a.shop.rating)
      .slice(0, 24)
  }, [shops, query, location])

  return <section className="discover-page">
    <div className="discover-intro">
      <div>
        <h1>Find your next barber</h1>
        <p>Browse trusted barbers across the UK and book in a few taps.</p>
      </div>
      <div className="barber-search">
        <Search size={19} aria-hidden="true"/>
        <label className="sr-only" htmlFor="barber-search">Search by barber, town or postcode</label>
        <input id="barber-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by town or postcode"/>
      </div>
    </div>

    {locationStatus === 'denied' && <p className="location-message">Location access is off. You can still search by town or postcode.</p>}
    {locationStatus === 'unavailable' && <p className="location-message">We could not get your location. Try searching by town or postcode.</p>}

    <div className="results-heading">
      <div className="results-title">
        <h2>{query ? `${results.length} ${results.length === 1 ? 'search result' : 'search results'}` : `${results.length} ${results.length === 1 ? 'barber' : 'barbers'} near you`}</h2>
        {!query && locationPermission === 'prompt' && locationSource !== 'precise' && <>
          <span className="results-separator" aria-hidden="true">·</span>
          <button type="button" onClick={() => requestLocation(true)} disabled={locationStatus === 'loading'}>{locationStatus === 'loading' ? 'Finding you…' : 'Use precise location'}</button>
        </>}
      </div>
    </div>
    <div className="shop-grid">
      {results.map(({ shop, distance }) => <button type="button" className="shop-card" key={shop.id} onClick={event => onSelect(shop.id, event.currentTarget.querySelector<HTMLElement>('.shop-card-image'))} aria-label={`View ${shop.name} in ${shop.town}`}>
        <span className="shop-card-image"><img src={shop.images[0].src} alt={shop.images[0].alt}/></span>
        <span className="shop-card-copy">
          <span className="shop-card-heading"><strong>{shop.name}</strong><span><Star size={14} fill="currentColor"/>{shop.rating}</span></span>
          <span className="shop-card-location">{shop.town} · {shop.postcode}{distance !== null && ` · ${distance < 0.1 ? '<0.1' : distance.toFixed(1)} miles`}</span>
          <span className="shop-card-next">Next: {shop.nextAvailable}</span>
          <span className="shop-card-price"><strong>From £{shop.priceFrom}</strong></span>
        </span>
      </button>)}
    </div>
    {!results.length && <div className="big-empty"><span><Search size={23}/></span><h2>No barbers found</h2><p>Try another town, postcode or barber name.</p></div>}
  </section>
}

function ShopHeader({ shop }: { shop: Shop }) {
  const [activeImage, setActiveImage] = useState(0)
  const swipeStart = useRef<number | null>(null)
  const showImage = (index: number) => setActiveImage((index + shop.images.length) % shop.images.length)

  const startSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    swipeStart.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const finishSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    if (swipeStart.current === null) return
    const distance = event.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(distance) < 42) return
    showImage(activeImage + (distance < 0 ? 1 : -1))
  }

  return <section className="shop-header" style={{ viewTransitionName: 'shop-hero' }}>
    <div className="shop-carousel" aria-roledescription="carousel" aria-label={`${shop.name} photos. Swipe left or right to change image.`} tabIndex={0} onPointerDown={startSwipe} onPointerUp={finishSwipe} onPointerCancel={() => { swipeStart.current = null }} onKeyDown={event => { if (event.key === 'ArrowLeft') showImage(activeImage - 1); if (event.key === 'ArrowRight') showImage(activeImage + 1) }}>
      <img key={shop.images[activeImage].src} src={shop.images[activeImage].src} width="1536" height="1024" alt={shop.images[activeImage].alt}/>
      <span className="sr-only" aria-live="polite">Image {activeImage + 1} of {shop.images.length}</span>
    </div>
    <div className="shop-copy"><h1>{shop.name}</h1><a className="address" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.address}, ${shop.postcode}`)}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${shop.address} in Google Maps`}><MapPin size={16}/>{shop.address} · {shop.postcode}</a><div className="rating"><strong>{shop.rating}</strong><span className="rating-stars" aria-label={`${shop.rating} out of 5 stars`}>★★★★★</span><Drawer.Root><Drawer.Trigger asChild><button type="button" className="review-count">{shop.reviewCount} verified reviews</button></Drawer.Trigger><Drawer.Portal><Drawer.Overlay className="review-overlay"/><Drawer.Content className="review-drawer"><Drawer.Handle className="drawer-handle"/><div className="drawer-heading"><div><Drawer.Title>Reviews</Drawer.Title><Drawer.Description>{shop.rating} from {shop.reviewCount} verified reviews</Drawer.Description></div><Drawer.Close asChild><button type="button" className="drawer-close" aria-label="Close reviews"><X size={20}/></button></Drawer.Close></div><div className="review-list">{REVIEWS.map(review => <article key={`${review.name}-${review.date}`}><div><strong>{review.name}</strong><time>{review.date}</time></div><span className="review-stars" aria-label="5 out of 5 stars">★★★★★</span><p>{review.text}</p></article>)}</div></Drawer.Content></Drawer.Portal></Drawer.Root></div></div>
  </section>
}

function LeaveBookingDrawer({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) {
  return <Drawer.Root open onOpenChange={open => { if (!open) onStay() }}>
    <Drawer.Portal>
      <Drawer.Overlay className="review-overlay"/>
      <Drawer.Content className="confirm-drawer">
        <Drawer.Handle className="drawer-handle"/>
        <div className="drawer-heading"><div><Drawer.Title>Leave booking?</Drawer.Title><Drawer.Description>Your selections will be lost.</Drawer.Description></div><Drawer.Close asChild><button type="button" className="drawer-close" aria-label="Continue booking"><X size={20}/></button></Drawer.Close></div>
        <div className="confirm-drawer-action"><button type="button" className="secondary-action" onClick={onStay}>Continue booking</button><button type="button" className="danger-primary" onClick={onLeave}>Leave booking</button></div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
}

function BookingFlow({ shop, staff, bookings, editing, onSave, onDirtyChange, onExit }: { shop: Shop; staff: Staff[]; bookings: Booking[]; editing?: Booking; onSave: (b: Booking) => void; onDirtyChange: (dirty: boolean) => void; onExit: () => void }) {
  const [step, setStep] = useState(editing ? 1 : 0)
  const [serviceId, setServiceId] = useState(editing?.serviceId || '')
  const [staffId, setStaffId] = useState(editing?.staffId || 'any')
  const [resolvedStaffId, setResolvedStaffId] = useState(editing?.staffId || '')
  const [date, setDate] = useState(editing?.date || todayISO())
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(`${editing?.date || todayISO()}T12:00:00`))
  const [time, setTime] = useState(editing?.time || '')
  const [customer, setCustomer] = useState(editing?.customer || '')
  const [email, setEmail] = useState(editing?.email || '')
  const [serviceError, setServiceError] = useState('')
  const [appointmentError, setAppointmentError] = useState('')
  const [detailsErrors, setDetailsErrors] = useState<{ customer?: string; email?: string }>({})
  const historyInitialised = useRef(false)
  const previousStepRef = useRef(step)
  const stepperRef = useRef<HTMLElement>(null)
  const serviceListRef = useRef<HTMLDivElement>(null)
  const timePickerRef = useRef<HTMLElement>(null)
  const customerRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const service = shop.services.find(s => s.id === serviceId)
  const person = staff.find(s => s.id === (resolvedStaffId || staffId))
  const steps = ['Service', 'Appointment', 'Details']
  const maxDate = todayISO(56)
  const isDirty = Boolean(serviceId || customer.trim() || email.trim())
  const canOpenStep = (stepIndex: number) => {
    if (stepIndex === 0) return true
    if (stepIndex === 1) return Boolean(serviceId)
    return Boolean(serviceId && time && resolvedStaffId)
  }

  const navigateToStep = (nextStep: number) => {
    if (nextStep < step) {
      window.history.go(nextStep - step)
      return
    }
    const url = new URL(window.location.href)
    url.searchParams.set('step', BOOKING_STEPS[nextStep])
    window.history.pushState({ ...window.history.state, bookingStep: nextStep }, '', `${url.pathname}${url.search}${url.hash}`)
    setStep(nextStep)
  }

  useEffect(() => {
    const initialStep = editing ? 1 : 0
    if (!historyInitialised.current) {
      const url = new URL(window.location.href)
      url.searchParams.set('step', BOOKING_STEPS[0])
      window.history.replaceState({ ...window.history.state, bookingStep: 0 }, '', `${url.pathname}${url.search}${url.hash}`)
      if (initialStep > 0) {
        url.searchParams.set('step', BOOKING_STEPS[initialStep])
        window.history.pushState({ ...window.history.state, bookingStep: initialStep }, '', `${url.pathname}${url.search}${url.hash}`)
      }
      historyInitialised.current = true
    }

    const handlePopState = () => {
      const requestedStep = BOOKING_STEPS.indexOf(new URL(window.location.href).searchParams.get('step') as typeof BOOKING_STEPS[number])
      setStep(requestedStep >= 0 ? requestedStep : 0)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [editing])

  useEffect(() => {
    onDirtyChange(isDirty)
    return () => onDirtyChange(false)
  }, [isDirty, onDirtyChange])

  useEffect(() => {
    if (!isDirty) return
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warnBeforeLeaving)
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving)
  }, [isDirty])

  useEffect(() => {
    if (previousStepRef.current === step) return
    previousStepRef.current = step
    requestAnimationFrame(() => {
      stepperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [step])

  const getSlots = (member: Staff, selectedDate: string) => {
    if (!service || !member.workingDays.includes(new Date(`${selectedDate}T12:00:00`).getDay())) return []
    const output: string[] = []; let cursor = member.start
    while (addMinutes(cursor, service.duration) <= member.end) { output.push(cursor); cursor = addMinutes(cursor, member.slotMinutes) }
    return output.filter(slot => !isPastSlot(selectedDate, slot) && !bookings.some(b => b.id !== editing?.id && b.staffId === member.id && b.date === selectedDate && b.time === slot && b.status === 'confirmed'))
  }
  const slotOptions = useMemo(() => {
    const members = staffId === 'any' ? staff : staff.filter(member => member.id === staffId)
    const options = members.flatMap(member => getSlots(member, date).map(slot => ({ time: slot, staffId: member.id })))
    return [...new Map(options.sort((a, b) => a.time.localeCompare(b.time)).map(option => [option.time, option])).values()]
  }, [staffId, date, staff, service, bookings, editing])
  const days = calendarDates(visibleMonth)
  const canGoBack = monthISO(visibleMonth) > monthISO(new Date(`${todayISO()}T12:00:00`))
  const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1)
  const canGoForward = `${monthISO(nextMonth)}-01` <= maxDate

  const chooseStaff = (nextStaffId: string) => {
    const members = nextStaffId === 'any' ? staff : staff.filter(member => member.id === nextStaffId)
    const nextDate = Array.from({ length: 57 }, (_, index) => todayISO(index)).find(item => members.some(member => getSlots(member, item).length)) || date
    setStaffId(nextStaffId); setResolvedStaffId(nextStaffId === 'any' ? '' : nextStaffId); setDate(nextDate); setVisibleMonth(new Date(`${nextDate}T12:00:00`)); setTime('')
  }

  const revealField = (element: HTMLElement | null) => {
    requestAnimationFrame(() => {
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      element?.focus({ preventScroll: true })
    })
  }

  const continueFromService = () => {
    if (!serviceId) {
      setServiceError('Select a service to continue.')
      revealField(serviceListRef.current?.querySelector('button') || null)
      return
    }
    setServiceError('')
    chooseStaff(staffId)
    navigateToStep(1)
  }

  const continueFromAppointment = () => {
    if (!time || !resolvedStaffId) {
      setAppointmentError('Choose an available time to continue.')
      revealField(timePickerRef.current?.querySelector<HTMLButtonElement>('.time-strip button') || timePickerRef.current)
      return
    }
    setAppointmentError('')
    navigateToStep(2)
  }

  const submit = () => {
    const nextErrors: { customer?: string; email?: string } = {}
    if (!customer.trim()) nextErrors.customer = 'Enter your full name.'
    if (!email.trim()) nextErrors.email = 'Enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Enter a valid email address.'
    setDetailsErrors(nextErrors)
    if (!serviceId || !resolvedStaffId || !time || Object.keys(nextErrors).length) {
      revealField(nextErrors.customer ? customerRef.current : emailRef.current)
      return
    }
    onSave({ id: editing?.id || `booking-${Date.now()}`, shopId: shop.id, customer: customer.trim(), email: email.trim(), serviceId, staffId: resolvedStaffId, date, time, status: 'confirmed' })
  }

  return <>
    <ShopHeader shop={shop}/>
    <section className="booking-layout">
      <div className="booking-card">
        {editing && <div className="editing-banner"><span>You’re changing an existing booking</span><button onClick={onExit}>Cancel changes</button></div>}
        <nav ref={stepperRef} className="stepper" aria-label={`Booking progress: step ${step + 1} of 3`}>
          {steps.map((label, index) => <Fragment key={label}>
            <div className="step-item">{index !== step && canOpenStep(index)
              ? <button type="button" className="completed" onClick={() => navigateToStep(index)} aria-label={`Go to ${label}`}>{label}</button>
              : <span className={index === step ? 'active' : 'upcoming'} aria-current={index === step ? 'step' : undefined}>{label}</span>}
            </div>
            {index < steps.length - 1 && <i className="step-chevron" aria-hidden="true">›</i>}
          </Fragment>)}
        </nav>

        {step === 0 && <div className="panel service-panel" aria-label="Choose a service"><div className="choice-list" role="radiogroup" aria-label="Choose a service" ref={serviceListRef}>
          {shop.services.map(item => <button key={item.id} role="radio" aria-checked={serviceId === item.id} className={`choice service-choice ${serviceId === item.id ? 'selected' : ''}`} onClick={() => { setServiceId(item.id); setServiceError('') }}><span><strong>{item.name}</strong><small>{item.duration} mins</small></span><b>£{item.price}</b><i aria-hidden="true"/></button>)}
        </div><div className="step-action desktop-booking-action">{serviceError && <p className="action-error" role="alert">{serviceError}</p>}<button className="primary" onClick={continueFromService}>Choose an appointment</button></div></div>}

        {step === 1 && <div className="panel appointment-panel" aria-label="Choose an appointment">
          <section className="barber-picker" aria-label="Barber"><div className="barber-strip" role="radiogroup" aria-label="Choose a barber">
            <button role="radio" aria-checked={staffId === 'any'} className={staffId === 'any' ? 'selected' : ''} onClick={() => chooseStaff('any')}><span className="barber-avatar neutral"><UsersRound size={21}/>{staffId === 'any' && <i><Check size={11}/></i>}</span><strong>First available</strong><small>Most times</small></button>
            {staff.map(item => <button role="radio" aria-checked={staffId === item.id} className={staffId === item.id ? 'selected' : ''} key={item.id} onClick={() => chooseStaff(item.id)}><span className="barber-avatar"><StaffPhoto id={item.id} name={item.name}/>{staffId === item.id && <i><Check size={11}/></i>}</span><strong>{item.name.split(' ')[0]}</strong><small>{item.role}</small></button>)}
          </div></section>
          <div className="appointment-schedule"><section className="calendar-card" aria-labelledby="calendar-title"><div className="calendar-head"><h3 id="calendar-title">{new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(visibleMonth)}</h3><div><button aria-label="Previous month" disabled={!canGoBack} onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}><ChevronLeft size={20}/></button><button aria-label="Next month" disabled={!canGoForward} onClick={() => setVisibleMonth(nextMonth)}><ChevronRight size={20}/></button></div></div><div className="weekdays">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{days.map(day => {
            const available = day.currentMonth && day.iso >= todayISO() && day.iso <= maxDate && (staffId === 'any' ? staff : staff.filter(member => member.id === staffId)).some(member => getSlots(member, day.iso).length)
            return <button key={day.iso} className={`${date === day.iso ? 'selected' : ''} ${available ? 'available' : ''}`} disabled={!available} aria-label={day.currentMonth ? formatDate(day.iso) : undefined} onClick={() => { setDate(day.iso); setTime(''); setResolvedStaffId(staffId === 'any' ? '' : staffId) }}>{day.currentMonth && <><span>{day.day}</span>{available && <i/>}</>}</button>
          })}</div></section>
          <section className="time-picker" aria-labelledby="time-title" ref={timePickerRef} tabIndex={-1}><div><h3 id="time-title"><span className="desktop-time-title">Available times</span><span className="mobile-time-title">{formatDate(date)}</span></h3><small>{staffId === 'any' ? 'All barbers' : `With ${staff.find(member => member.id === staffId)?.name}`}</small></div>{slotOptions.length ? <div className="time-strip" role="radiogroup" aria-label={`Choose a time on ${formatDate(date)}`}>{slotOptions.map(option => <button role="radio" aria-checked={time === option.time} className={time === option.time ? 'selected' : ''} onClick={() => { setTime(option.time); setResolvedStaffId(option.staffId); setAppointmentError('') }} key={option.time}>{option.time}</button>)}</div> : <div className="empty compact"><strong>No times available</strong><span>Choose another date or barber.</span></div>}</section></div>
          <div className="appointment-action desktop-booking-action">{appointmentError && <p className="action-error" role="alert">{appointmentError}</p>}<div><small>{service?.name} · {service?.duration} mins</small><strong>£{service?.price}</strong>{time && <span>{formatDate(date, true)} at {time}{person ? ` with ${person.name.split(' ')[0]}` : ''}</span>}</div><button className="primary" onClick={continueFromAppointment}>Enter your details</button></div>
        </div>}

        {step === 2 && <div className="panel details-panel" aria-label="Your details">
          <label>Full name<input ref={customerRef} name="name" value={customer} onChange={e => { setCustomer(e.target.value); if (e.target.value.trim()) setDetailsErrors(errors => ({ ...errors, customer: undefined })) }} placeholder="e.g. James Taylor…" autoComplete="name" aria-invalid={Boolean(detailsErrors.customer)}/>{detailsErrors.customer && <span className="field-error" role="alert">{detailsErrors.customer}</span>}</label>
          <label>Email address<input ref={emailRef} name="email" value={email} onChange={e => { setEmail(e.target.value); if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value.trim())) setDetailsErrors(errors => ({ ...errors, email: undefined })) }} placeholder="you@example.com…" type="email" inputMode="email" spellCheck={false} autoComplete="email" aria-invalid={Boolean(detailsErrors.email)}/>{detailsErrors.email && <span className="field-error" role="alert">{detailsErrors.email}</span>}</label>
          <div className="summary"><div><Scissors size={17}/><span><small>Service</small><strong>{service?.name}</strong></span></div><div><PoundSterling size={17}/><span><small>Price</small><strong>£{service?.price}</strong></span></div><div><UserRound size={17}/><span><small>With</small><strong>{person?.name}</strong></span></div><div><CalendarDays size={17}/><span><small>When</small><strong>{formatDate(date, true)} at {time}</strong></span></div></div>
          <p className="fine-print"><CreditCard size={28} aria-hidden="true"/>No payment is required. You can change or cancel this booking later.</p>
          <div className="step-action desktop-booking-action"><button className="primary" onClick={submit}>{editing ? 'Save changes' : 'Confirm booking'}</button></div>
        </div>}
      </div>
      <aside><h3>Your appointment</h3>{service ? <><SummaryRow label="Service" value={service.name}/><SummaryRow label="Duration" value={`${service.duration} mins`}/><SummaryRow label="Price" value={`£${service.price}`}/>{person && <SummaryRow label="Professional" value={person.name}/>} {time && <SummaryRow label="Time" value={`${formatDate(date, true)}, ${time}`}/>}</> : <p className="muted">Your selection will appear here.</p>}</aside>
    </section>
    {typeof document !== 'undefined' && createPortal(
      step === 1
        ? <div className="mobile-booking-action appointment-action">{appointmentError && <p className="action-error" role="alert">{appointmentError}</p>}<div><small>{service?.name} · {service?.duration} mins</small><strong>£{service?.price}</strong>{time && <span>{formatDate(date, true)} at {time}{person ? ` with ${person.name.split(' ')[0]}` : ''}</span>}</div><button className="primary" onClick={continueFromAppointment}>Enter your details</button></div>
        : <div className="mobile-booking-action step-action">{step === 0 && serviceError && <p className="action-error" role="alert">{serviceError}</p>}<button className="primary" onClick={step === 0 ? continueFromService : submit}>{step === 0 ? 'Choose an appointment' : editing ? 'Save changes' : 'Confirm booking'}</button></div>,
      document.body
    )}
  </>
}

function SummaryRow({ label, value }: { label: string; value: string }) { return <div className="summary-row"><span>{label}</span><strong>{value}</strong></div> }

function ChangeBookingDrawer({ booking, shop, person, bookings, onSave, onClose }: { booking: Booking; shop: Shop; person?: Staff; bookings: Booking[]; onSave: (booking: Booking) => void; onClose: () => void }) {
  const service = shop.services.find(item => item.id === booking.serviceId)
  const [date, setDate] = useState(booking.date)
  const [time, setTime] = useState(booking.time)
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(`${booking.date}T12:00:00`))
  const [error, setError] = useState('')
  const timePickerRef = useRef<HTMLElement>(null)
  const maxDate = todayISO(56)
  const days = calendarDates(visibleMonth)
  const canGoBack = monthISO(visibleMonth) > monthISO(new Date(`${todayISO()}T12:00:00`))
  const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1)
  const canGoForward = `${monthISO(nextMonth)}-01` <= maxDate

  const slotsForDate = (selectedDate: string) => {
    if (!service || !person || !person.workingDays.includes(new Date(`${selectedDate}T12:00:00`).getDay())) return []
    const slots: string[] = []
    let cursor = person.start
    while (addMinutes(cursor, service.duration) <= person.end) {
      slots.push(cursor)
      cursor = addMinutes(cursor, person.slotMinutes)
    }
    return slots.filter(slot => !isPastSlot(selectedDate, slot) && !bookings.some(item => item.id !== booking.id && item.staffId === person.id && item.date === selectedDate && item.time === slot && item.status === 'confirmed'))
  }
  const slots = slotsForDate(date)

  const save = () => {
    if (!time) {
      setError('Choose an available time to continue.')
      requestAnimationFrame(() => {
        const target = timePickerRef.current?.querySelector<HTMLButtonElement>('.time-strip button') || timePickerRef.current
        target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        target?.focus({ preventScroll: true })
      })
      return
    }
    onSave({ ...booking, date, time })
    onClose()
  }

  return <Drawer.Root open onOpenChange={open => { if (!open) onClose() }}>
    <Drawer.Portal>
      <Drawer.Overlay className="review-overlay"/>
      <Drawer.Content className="change-drawer">
        <Drawer.Handle className="drawer-handle"/>
        <div className="drawer-heading"><div><Drawer.Title>Change booking</Drawer.Title><Drawer.Description>{service?.name}{person ? ` with ${person.name}` : ''}</Drawer.Description></div><Drawer.Close asChild><button type="button" className="drawer-close" aria-label="Close change booking"><X size={20}/></button></Drawer.Close></div>
        <div className="change-drawer-body">
          <section className="calendar-card" aria-labelledby="change-calendar-title"><div className="calendar-head"><h3 id="change-calendar-title">{new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(visibleMonth)}</h3><div><button aria-label="Previous month" disabled={!canGoBack} onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}><ChevronLeft size={20}/></button><button aria-label="Next month" disabled={!canGoForward} onClick={() => setVisibleMonth(nextMonth)}><ChevronRight size={20}/></button></div></div><div className="weekdays">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{days.map(day => {
            const available = day.currentMonth && day.iso >= todayISO() && day.iso <= maxDate && slotsForDate(day.iso).length > 0
            return <button key={day.iso} className={`${date === day.iso ? 'selected' : ''} ${available ? 'available' : ''}`} disabled={!available} aria-label={day.currentMonth ? formatDate(day.iso) : undefined} onClick={() => { setDate(day.iso); setTime(''); setError('') }}>{day.currentMonth && <><span>{day.day}</span>{available && <i/>}</>}</button>
          })}</div></section>
          <section className="time-picker" aria-labelledby="change-time-title" ref={timePickerRef} tabIndex={-1}><div><h3 id="change-time-title">{formatDate(date)}</h3><small>{person?.name}</small></div>{slots.length ? <div className="time-strip" role="radiogroup" aria-label={`Choose a time on ${formatDate(date)}`}>{slots.map(slot => <button role="radio" aria-checked={time === slot} className={time === slot ? 'selected' : ''} onClick={() => { setTime(slot); setError('') }} key={slot}>{slot}</button>)}</div> : <div className="empty compact"><strong>No times available</strong><span>Choose another date.</span></div>}</section>
        </div>
        <div className="change-drawer-action">{error && <p className="action-error" role="alert">{error}</p>}<button type="button" className="primary" onClick={save}>Save changes</button></div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
}

function CancelBookingDrawer({ booking, shop, onConfirm, onClose }: { booking: Booking; shop: Shop; onConfirm: () => void; onClose: () => void }) {
  const service = shop.services.find(item => item.id === booking.serviceId)
  return <Drawer.Root open onOpenChange={open => { if (!open) onClose() }}>
    <Drawer.Portal>
      <Drawer.Overlay className="review-overlay"/>
      <Drawer.Content className="confirm-drawer">
        <Drawer.Handle className="drawer-handle"/>
        <div className="drawer-heading"><div><Drawer.Title>Cancel booking</Drawer.Title><Drawer.Description>{service?.name} on {formatDate(booking.date)} at {booking.time}</Drawer.Description></div><Drawer.Close asChild><button type="button" className="drawer-close" aria-label="Close cancellation confirmation"><X size={20}/></button></Drawer.Close></div>
        <div className="confirm-drawer-action"><button type="button" className="secondary-action" onClick={onClose}>Keep booking</button><button type="button" className="danger-primary" onClick={onConfirm}>Cancel booking</button></div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
}

function MyBookings({ bookings, shops, staff, onChange, onCancel }: { bookings: Booking[]; shops: Shop[]; staff: Staff[]; onChange: (booking: Booking) => void; onCancel: (id: string) => void }) {
  const [showCancelled, setShowCancelled] = useState(false)
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null)
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null)
  const customerBookings = bookings.filter(b => !b.id.startsWith('demo-')).sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
  const currentBookings = customerBookings.filter(booking => booking.status !== 'cancelled')
  const cancelledBookings = customerBookings.filter(booking => booking.status === 'cancelled')
  const editingBooking = bookings.find(booking => booking.id === editingBookingId)
  const cancellingBooking = bookings.find(booking => booking.id === cancellingBookingId)
  const renderBooking = (booking: Booking) => {
    const shop = shops.find(item => item.id === booking.shopId) || shops[0]
    const service = shop.services.find(s => s.id === booking.serviceId)
    const person = staff.find(s => s.id === booking.staffId)
    return <article className={`booking-item ${booking.status}`} key={booking.id}><div className="date-tile"><strong>{new Date(`${booking.date}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(new Date(`${booking.date}T12:00:00`))}</span></div><div className="booking-info"><span className={`status ${booking.status}`}>{booking.status}</span><h2>{service?.name}</h2><p>{formatDate(booking.date)} at {booking.time}</p><small>{person?.name} · {shop.name}</small></div>{booking.status === 'confirmed' && <div className="booking-actions"><button onClick={() => setEditingBookingId(booking.id)}>Change</button><button className="danger" onClick={() => setCancellingBookingId(booking.id)}>Cancel booking</button></div>}</article>
  }
  return <section className="page"><h1>My bookings</h1><p className="lead">View, change or cancel appointments made on this device.</p>
    {currentBookings.length ? <div className="booking-list">{currentBookings.map(renderBooking)}</div> : <div className="big-empty"><span><CalendarDays size={28}/></span><h2>{cancelledBookings.length ? 'No current bookings' : 'No bookings yet'}</h2><p>{cancelledBookings.length ? 'Book another appointment when you are ready.' : 'Once you book an appointment, it will appear here.'}</p></div>}
    {cancelledBookings.length > 0 && <div className="cancelled-section"><button type="button" className="cancelled-toggle" aria-expanded={showCancelled} aria-controls="cancelled-bookings" onClick={() => setShowCancelled(value => !value)}><span>{showCancelled ? 'Hide' : 'View'} cancelled bookings ({cancelledBookings.length})</span><ChevronDown size={18} aria-hidden="true"/></button>{showCancelled && <div className="booking-list cancelled-bookings" id="cancelled-bookings">{cancelledBookings.map(renderBooking)}</div>}</div>}
    {editingBooking && <ChangeBookingDrawer key={editingBooking.id} booking={editingBooking} shop={shops.find(shop => shop.id === editingBooking.shopId) || shops[0]} person={staff.find(person => person.id === editingBooking.staffId)} bookings={bookings} onSave={onChange} onClose={() => setEditingBookingId(null)}/>}
    {cancellingBooking && <CancelBookingDrawer booking={cancellingBooking} shop={shops.find(shop => shop.id === cancellingBooking.shopId) || shops[0]} onClose={() => setCancellingBookingId(null)} onConfirm={() => { onCancel(cancellingBooking.id); setCancellingBookingId(null); toast.success('Booking cancelled') }}/>}
  </section>
}

function Admin({ shop, staff, setStaff, bookings, setBookings }: { shop: Shop; staff: Staff[]; setStaff: React.Dispatch<React.SetStateAction<Staff[]>>; bookings: Booking[]; setBookings: React.Dispatch<React.SetStateAction<Booking[]>> }) {
  const [tab, setTab] = useState<'diary' | 'team'>('diary'); const [date, setDate] = useState(todayISO(1))
  const dayBookings = bookings.filter(b => b.date === date && b.status === 'confirmed').sort((a, b) => a.time.localeCompare(b.time))
  const updateStaff = (id: string, change: Partial<Staff>) => setStaff(items => items.map(item => item.id === id ? { ...item, ...change } : item))
  const toggleDay = (member: Staff, day: number) => updateStaff(member.id, { workingDays: member.workingDays.includes(day) ? member.workingDays.filter(d => d !== day) : [...member.workingDays, day].sort() })
  const complete = (id: string) => setBookings(items => items.map(item => item.id === id ? { ...item, status: 'completed' } : item))
  return <section className="admin-page"><div className="admin-head"><div><span className="eyebrow">{shop.name}</span><h1>Good morning</h1><p>Manage appointments and team availability.</p></div><div className="admin-metric"><span>Today</span><strong>{bookings.filter(b => b.date === todayISO() && b.status === 'confirmed').length}</strong><small>appointments</small></div></div><div className="admin-tabs"><button className={tab === 'diary' ? 'active' : ''} onClick={() => setTab('diary')}><CalendarDays size={17}/>Diary</button><button className={tab === 'team' ? 'active' : ''} onClick={() => setTab('team')}><UsersRound size={17}/>Team & hours</button></div>
    {tab === 'diary' ? <div className="admin-section"><div className="section-title"><div><h2>Appointments</h2><p>{formatDate(date)}</p></div><input type="date" value={date} onChange={e => setDate(e.target.value)}/></div>{dayBookings.length ? <div className="diary">{dayBookings.map(booking => { const service = shop.services.find(s => s.id === booking.serviceId); const person = staff.find(s => s.id === booking.staffId); return <article key={booking.id}><time>{booking.time}<small>{addMinutes(booking.time, service?.duration || 30)}</small></time>{person && <StaffPhoto id={person.id} name={person.name}/>}<div><h3>{booking.customer}</h3><p>{service?.name} with {person?.name}</p></div><button onClick={() => complete(booking.id)}><Check size={15}/>Complete</button></article>})}</div> : <div className="big-empty compact"><span><CalendarDays size={25}/></span><h2>No appointments</h2><p>There are no confirmed bookings for this date.</p></div>}</div> : <div className="admin-section"><div className="section-title"><div><h2>Team availability</h2><p>Set working days, hours and booking intervals.</p></div></div><div className="staff-settings">{staff.map(member => <article key={member.id}><div className="staff-title"><StaffPhoto id={member.id} name={member.name}/><div><h3>{member.name}</h3><p>{member.role}</p></div></div><div className="field-group"><label>Working days</label><div className="day-pills">{['S','M','T','W','T','F','S'].map((day, index) => <button key={index} className={member.workingDays.includes(index) ? 'active' : ''} onClick={() => toggleDay(member, index)}>{day}</button>)}</div></div><div className="field-row"><label>Starts<input type="time" value={member.start} onChange={e => updateStaff(member.id, { start: e.target.value })}/></label><label>Finishes<input type="time" value={member.end} onChange={e => updateStaff(member.id, { end: e.target.value })}/></label><label>Slot length<select value={member.slotMinutes} onChange={e => updateStaff(member.id, { slotMinutes: Number(e.target.value) })}><option value="15">15 mins</option><option value="30">30 mins</option><option value="45">45 mins</option><option value="60">60 mins</option></select></label></div></article>)}</div></div>}
  </section>
}

export default App
