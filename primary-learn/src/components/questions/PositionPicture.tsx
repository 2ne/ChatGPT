import { Pip } from "../mascot/Pip";
import type { PositionScene } from "../../types/activity";
export function PositionPicture({ scene }: { scene: PositionScene }) {
  const object = <svg viewBox="0 0 140 160" aria-hidden>
    {scene.object === "tree" ? <><rect x="58" y="72" width="24" height="78" rx="6" fill="#a67442"/><path d="M70 6 C12 12 0 73 23 97 C46 116 99 111 121 93 C145 69 125 11 70 6" fill="#55b58b"/><path d="M70 50 V115 M70 80 L45 62 M70 94 L94 72" stroke="#379470" strokeWidth="5" fill="none"/></> : scene.object === "box" ? <g strokeLinejoin="round">
      <path d="M14 49 L70 25 L126 49 L70 73 Z" fill="#edcf9e"/>
      <path d="M14 49 L70 73 L70 145 L14 121 Z" fill="#c99b63"/>
      <path d="M70 73 L126 49 L126 121 L70 145 Z" fill="#ae7d48"/>
      <path d="M37 39 L48 34 L104 58 L93 63 Z" fill="#d9b77f"/>
      <path d="M93 63 L104 58 L104 130 L93 135 Z" fill="#c69a60"/>
      <path d="M14 49 L70 25 L126 49 L126 121 L70 145 L14 121 Z M14 49 L70 73 L126 49 M70 73 V145" fill="none" stroke="#92663d" strokeWidth="2.5"/>
      <path d="M23 78 L49 89 L49 108 L23 97 Z" fill="#fff6e8"/>
      <path d="M29 86 L42 92 M29 91 L38 95" stroke="#b99a73" strokeWidth="2" strokeLinecap="round"/>
    </g> : scene.object === "kite" ? <><path d="M70 8 L117 59 L70 116 L23 59 Z" fill="#7567e8"/><path d="M70 8 V116 M23 59 H117" stroke="#fff" strokeWidth="3"/><path d="M70 116 Q100 133 70 155" fill="none" stroke="#5b5e7a" strokeWidth="3"/></> : <><ellipse cx="72" cy="83" rx="44" ry="28" fill="#469ad4"/><circle cx="101" cy="58" r="24" fill="#469ad4"/><path d="M120 58 L138 67 L120 73" fill="#e9a34c"/><circle cx="108" cy="54" r="4" fill="#232946"/><path d="M44 79 Q71 17 84 83" fill="#83c8ee"/><path d="M35 86 L8 63 L14 100 Z" fill="#469ad4"/></>}
  </svg>;
  return <figure className={`position-scene is-${scene.relation}`} role="img" aria-label={`The ${scene.object} is ${scene.relation.replace("-", " ")} Pip.`}>
    <div className="position-ground" aria-hidden />
    <div className="position-object" aria-hidden>{object}</div>
    <div className="position-pip" aria-hidden><Pip size={130}/></div>
  </figure>;
}
