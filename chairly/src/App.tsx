import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, ChevronLeft, Clock3, MapPin, Scissors, Settings2, UserRound, UsersRound } from 'lucide-react'

type View = 'book' | 'bookings' | 'admin'
type BookingStatus = 'confirmed' | 'completed' | 'cancelled'
type Staff = { id: string; name: string; role: string; initials: string; colour: string; workingDays: number[]; start: string; end: string; slotMinutes: number }
type Service = { id: string; name: string; duration: number; price: number }
type Booking = { id: string; customer: string; email: string; serviceId: string; staffId: string; date: string; time: string; status: BookingStatus }

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

const seedBookings: Booking[] = [
  { id: 'demo-1', customer: 'Jamie Collins', email: 'jamie@example.com', serviceId: 'cut', staffId: 'alex', date: todayISO(1), time: '10:00', status: 'confirmed' },
  { id: 'demo-2', customer: 'Ravi Patel', email: 'ravi@example.com', serviceId: 'skin', staffId: 'sam', date: todayISO(1), time: '12:30', status: 'confirmed' },
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

function StaffPhoto({ id, name }: { id: string; name: string }) {
  return <img className="staff-photo" src={`https://chairly-booking.abuzz-pin-8545.chatgpt.site/staff/${id}.webp`} width="44" height="44" alt="" aria-hidden="true" />
}

function App() {
  const [view, setView] = useState<View>('book')
  const [staff, setStaff] = useState<Staff[]>(() => typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('chairly-staff') || 'null') || INITIAL_STAFF) : INITIAL_STAFF)
  const [bookings, setBookings] = useState<Booking[]>(() => typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('chairly-bookings') || 'null') || seedBookings) : seedBookings)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => localStorage.setItem('chairly-staff', JSON.stringify(staff)), [staff])
  useEffect(() => localStorage.setItem('chairly-bookings', JSON.stringify(bookings)), [bookings])

  const editBooking = (id: string) => { setEditingId(id); setView('book') }
  const saveBooking = (booking: Booking) => {
    setBookings(current => current.some(item => item.id === booking.id) ? current.map(item => item.id === booking.id ? booking : item) : [...current, booking])
    setEditingId(null); setView('bookings')
  }
  const cancelBooking = (id: string) => setBookings(current => current.map(item => item.id === id ? { ...item, status: 'cancelled' } : item))

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="topbar">
      <button className="brand" onClick={() => setView('book')} aria-label="Snip home"><span className="barber-mark"><Scissors size={17}/></span>SNIP</button>
      <nav aria-label="Main navigation">
        <button className={view === 'book' ? 'active' : ''} onClick={() => { setEditingId(null); setView('book') }}>Book</button>
        <button className={view === 'bookings' ? 'active' : ''} onClick={() => setView('bookings')}>My bookings</button>
        <button className={view === 'admin' ? 'active' : ''} onClick={() => setView('admin')}><Settings2 size={16}/>Admin</button>
      </nav>
    </header>
    <main id="main-content">
      {view === 'book' && <BookingFlow staff={staff} bookings={bookings} editing={bookings.find(b => b.id === editingId)} onSave={saveBooking} onExit={() => { setEditingId(null); setView('bookings') }}/>} 
      {view === 'bookings' && <MyBookings bookings={bookings} staff={staff} onEdit={editBooking} onCancel={cancelBooking}/>} 
      {view === 'admin' && <Admin staff={staff} setStaff={setStaff} bookings={bookings} setBookings={setBookings}/>} 
    </main>
  </div>
}

function ShopHeader() {
  return <section className="shop-header">
    <div className="shop-image"><div className="image-label"><span>NL</span></div></div>
        <div className="shop-copy"><span className="eyebrow">Independent barber · Brighton</span><h1>North Laine<br/>Barber Co.</h1><p><MapPin size={16}/>18 Gardner Street, Brighton</p><div className="rating"><strong>4.9</strong><span>★★★★★</span><small>127 verified reviews</small></div></div>
  </section>
}

function BookingFlow({ staff, bookings, editing, onSave, onExit }: { staff: Staff[]; bookings: Booking[]; editing?: Booking; onSave: (b: Booking) => void; onExit: () => void }) {
  const [step, setStep] = useState(editing ? 2 : 0)
  const [serviceId, setServiceId] = useState(editing?.serviceId || '')
  const [staffId, setStaffId] = useState(editing?.staffId || '')
  const [date, setDate] = useState(editing?.date || todayISO())
  const [time, setTime] = useState(editing?.time || '')
  const [customer, setCustomer] = useState(editing?.customer || '')
  const [email, setEmail] = useState(editing?.email || '')
  const service = SERVICES.find(s => s.id === serviceId)
  const person = staff.find(s => s.id === staffId)
  const dates = Array.from({ length: 14 }, (_, index) => todayISO(index))
  const slots = useMemo(() => {
    if (!person || !service || !person.workingDays.includes(new Date(`${date}T12:00:00`).getDay())) return []
    const output: string[] = []; let cursor = person.start
    while (addMinutes(cursor, service.duration) <= person.end) { output.push(cursor); cursor = addMinutes(cursor, person.slotMinutes) }
    return output.filter(slot => !isPastSlot(date, slot) && !bookings.some(b => b.id !== editing?.id && b.staffId === person.id && b.date === date && b.time === slot && b.status === 'confirmed'))
  }, [person, service, date, bookings, editing])
  const steps = ['Service', 'Professional', 'Time', 'Details']

  const submit = () => {
    if (!serviceId || !staffId || !time || !customer.trim() || !email.includes('@')) return
    onSave({ id: editing?.id || `booking-${Date.now()}`, customer: customer.trim(), email: email.trim(), serviceId, staffId, date, time, status: 'confirmed' })
  }

  return <>
    <ShopHeader/>
    <section className="booking-layout">
      <div className="booking-card">
        {editing && <div className="editing-banner"><span>You’re changing an existing booking</span><button onClick={onExit}>Cancel changes</button></div>}
        <div className="stepper" aria-label={`Step ${step + 1} of 4`}>
          {steps.map((label, index) => <div className={index <= step ? 'done' : ''} key={label}><span>{index < step ? <Check size={14}/> : index + 1}</span><small>{label}</small></div>)}
        </div>

        {step === 0 && <div className="panel"><span className="eyebrow">Step 1 of 4</span><h2>Choose a service</h2><p className="muted">Select what you’d like to book.</p><div className="choice-list">
          {SERVICES.map(item => <button key={item.id} className={`choice service-choice ${serviceId === item.id ? 'selected' : ''}`} onClick={() => setServiceId(item.id)}><span><strong>{item.name}</strong><small><Clock3 size={14}/>{item.duration} mins</small></span><b>£{item.price}</b><i>{serviceId === item.id && <Check size={14}/>}</i></button>)}
        </div><button className="primary" disabled={!serviceId} onClick={() => setStep(1)}>Choose a barber</button></div>}

        {step === 1 && <div className="panel"><Back onClick={() => setStep(0)}/><span className="eyebrow">Step 2 of 4</span><h2>Choose your barber</h2><p className="muted">Pick a professional or choose the first available.</p><div className="choice-list">
          <button className={`choice ${staffId === 'any' ? 'selected' : ''}`} onClick={() => setStaffId('any')}><span className="avatar neutral"><UsersRound size={19}/></span><span><strong>First available</strong><small>Show the most appointment times</small></span><i>{staffId === 'any' && <Check size={14}/>}</i></button>
          {staff.map(item => <button key={item.id} className={`choice ${staffId === item.id ? 'selected' : ''}`} onClick={() => setStaffId(item.id)}><StaffPhoto id={item.id} name={item.name}/><span><strong>{item.name}</strong><small>{item.role}</small></span><i>{staffId === item.id && <Check size={14}/>}</i></button>)}
        </div><button className="primary" disabled={!staffId} onClick={() => { if (staffId === 'any') setStaffId(staff[0].id); setTime(''); setStep(2) }}>Choose a time</button></div>}

        {step === 2 && <div className="panel"><Back onClick={() => setStep(1)}/><span className="eyebrow">Step 3 of 4</span><h2>Choose a time</h2><p className="muted">Times shown are local to Brighton. Book up to 8 weeks ahead.</p><div className="date-picker-head"><strong>Next 14 days</strong><label>More dates<input aria-label="Choose another date" type="date" min={todayISO()} max={todayISO(56)} value={date} onChange={event => { setDate(event.target.value); setTime('') }}/></label></div><div className="date-strip">{dates.map(item => <button className={date === item ? 'selected' : ''} key={item} onClick={() => { setDate(item); setTime('') }}><small>{formatDate(item, true).split(' ')[0]}</small><strong>{new Date(`${item}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(new Date(`${item}T12:00:00`))}</span></button>)}</div>
          <h3>{formatDate(date)}</h3>{slots.length ? <div className="slots">{slots.map(slot => <button className={time === slot ? 'selected' : ''} onClick={() => setTime(slot)} key={slot}>{slot}</button>)}</div> : <div className="empty"><CalendarDays size={22}/><strong>No times available</strong><span>Choose another date or professional.</span></div>}<button className="primary" disabled={!time} onClick={() => setStep(3)}>Enter your details</button>
        </div>}

        {step === 3 && <div className="panel"><Back onClick={() => setStep(2)}/><span className="eyebrow">Step 4 of 4</span><h2>Your details</h2><p className="muted">We’ll use these details to identify your booking.</p><label>Full name<input name="name" value={customer} onChange={e => setCustomer(e.target.value)} placeholder="e.g. James Taylor…" autoComplete="name"/></label><label>Email address<input name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com…" type="email" inputMode="email" spellCheck={false} autoComplete="email"/></label><div className="summary"><div><Scissors size={17}/><span><small>Service</small><strong>{service?.name}</strong></span></div><div><UserRound size={17}/><span><small>With</small><strong>{person?.name}</strong></span></div><div><CalendarDays size={17}/><span><small>When</small><strong>{formatDate(date, true)} at {time}</strong></span></div></div><button className="primary" disabled={!customer.trim() || !email.includes('@')} onClick={submit}>{editing ? 'Save changes' : 'Confirm booking'}</button><p className="fine-print">No payment is required. You can change or cancel this booking later.</p></div>}
      </div>
      <aside><h3>Your appointment</h3>{service ? <><SummaryRow label="Service" value={service.name}/><SummaryRow label="Duration" value={`${service.duration} mins`}/><SummaryRow label="Price" value={`£${service.price}`}/>{person && <SummaryRow label="Professional" value={person.name}/>} {time && <SummaryRow label="Time" value={`${formatDate(date, true)}, ${time}`}/>}</> : <p className="muted">Your selection will appear here.</p>}</aside>
    </section>
  </>
}

function Back({ onClick }: { onClick: () => void }) { return <button className="back" onClick={onClick}><ChevronLeft size={17}/>Back</button> }
function SummaryRow({ label, value }: { label: string; value: string }) { return <div className="summary-row"><span>{label}</span><strong>{value}</strong></div> }

function MyBookings({ bookings, staff, onEdit, onCancel }: { bookings: Booking[]; staff: Staff[]; onEdit: (id: string) => void; onCancel: (id: string) => void }) {
  const customerBookings = bookings.filter(b => !b.id.startsWith('demo-')).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  return <section className="page"><span className="eyebrow">Customer area</span><h1>My bookings</h1><p className="lead">View, change or cancel appointments made on this device.</p>
    {!customerBookings.length ? <div className="big-empty"><span><CalendarDays size={28}/></span><h2>No bookings yet</h2><p>Once you book an appointment, it will appear here.</p></div> : <div className="booking-list">{customerBookings.map(booking => {
      const service = SERVICES.find(s => s.id === booking.serviceId); const person = staff.find(s => s.id === booking.staffId)
      return <article className={`booking-item ${booking.status}`} key={booking.id}><div className="date-tile"><strong>{new Date(`${booking.date}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(new Date(`${booking.date}T12:00:00`))}</span></div><div className="booking-info"><span className={`status ${booking.status}`}>{booking.status}</span><h2>{service?.name}</h2><p>{formatDate(booking.date)} at {booking.time}</p><small>{person?.name} · North Laine Barber Co.</small></div>{booking.status === 'confirmed' && <div className="booking-actions"><button onClick={() => onEdit(booking.id)}>Change</button><button className="danger" onClick={() => { if (window.confirm('Cancel this booking?')) onCancel(booking.id) }}>Cancel booking</button></div>}</article>
    })}</div>}
  </section>
}

function Admin({ staff, setStaff, bookings, setBookings }: { staff: Staff[]; setStaff: React.Dispatch<React.SetStateAction<Staff[]>>; bookings: Booking[]; setBookings: React.Dispatch<React.SetStateAction<Booking[]>> }) {
  const [tab, setTab] = useState<'diary' | 'team'>('diary'); const [date, setDate] = useState(todayISO(1))
  const dayBookings = bookings.filter(b => b.date === date && b.status === 'confirmed').sort((a, b) => a.time.localeCompare(b.time))
  const updateStaff = (id: string, change: Partial<Staff>) => setStaff(items => items.map(item => item.id === id ? { ...item, ...change } : item))
  const toggleDay = (member: Staff, day: number) => updateStaff(member.id, { workingDays: member.workingDays.includes(day) ? member.workingDays.filter(d => d !== day) : [...member.workingDays, day].sort() })
  const complete = (id: string) => setBookings(items => items.map(item => item.id === id ? { ...item, status: 'completed' } : item))
  return <section className="admin-page"><div className="admin-head"><div><span className="eyebrow">North Laine Barber Co.</span><h1>Good morning</h1><p>Manage appointments and team availability.</p></div><div className="admin-metric"><span>Today</span><strong>{bookings.filter(b => b.date === todayISO() && b.status === 'confirmed').length}</strong><small>appointments</small></div></div><div className="admin-tabs"><button className={tab === 'diary' ? 'active' : ''} onClick={() => setTab('diary')}><CalendarDays size={17}/>Diary</button><button className={tab === 'team' ? 'active' : ''} onClick={() => setTab('team')}><UsersRound size={17}/>Team & hours</button></div>
    {tab === 'diary' ? <div className="admin-section"><div className="section-title"><div><h2>Appointments</h2><p>{formatDate(date)}</p></div><input type="date" value={date} onChange={e => setDate(e.target.value)}/></div>{dayBookings.length ? <div className="diary">{dayBookings.map(booking => { const service = SERVICES.find(s => s.id === booking.serviceId); const person = staff.find(s => s.id === booking.staffId); return <article key={booking.id}><time>{booking.time}<small>{addMinutes(booking.time, service?.duration || 30)}</small></time>{person && <StaffPhoto id={person.id} name={person.name}/>}<div><h3>{booking.customer}</h3><p>{service?.name} with {person?.name}</p></div><button onClick={() => complete(booking.id)}><Check size={15}/>Complete</button></article>})}</div> : <div className="big-empty compact"><span><CalendarDays size={25}/></span><h2>No appointments</h2><p>There are no confirmed bookings for this date.</p></div>}</div> : <div className="admin-section"><div className="section-title"><div><h2>Team availability</h2><p>Set working days, hours and booking intervals.</p></div></div><div className="staff-settings">{staff.map(member => <article key={member.id}><div className="staff-title"><StaffPhoto id={member.id} name={member.name}/><div><h3>{member.name}</h3><p>{member.role}</p></div></div><div className="field-group"><label>Working days</label><div className="day-pills">{['S','M','T','W','T','F','S'].map((day, index) => <button key={index} className={member.workingDays.includes(index) ? 'active' : ''} onClick={() => toggleDay(member, index)}>{day}</button>)}</div></div><div className="field-row"><label>Starts<input type="time" value={member.start} onChange={e => updateStaff(member.id, { start: e.target.value })}/></label><label>Finishes<input type="time" value={member.end} onChange={e => updateStaff(member.id, { end: e.target.value })}/></label><label>Slot length<select value={member.slotMinutes} onChange={e => updateStaff(member.id, { slotMinutes: Number(e.target.value) })}><option value="15">15 mins</option><option value="30">30 mins</option><option value="45">45 mins</option><option value="60">60 mins</option></select></label></div></article>)}</div></div>}
  </section>
}

export default App
