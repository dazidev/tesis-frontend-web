import React from "react";

const pasos = [
  "Denuncia del juicio sucesorio",
  "Nombramiento de herederos y albacea",
  "Inventario y avalúo",
  "Partición y adjudicación",
  "Sentencia",
];

export default function ProcessMapView() {
  return (
    <div className="w-full bg-[#ffffff] py-16 px-6">
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 max-w-6xl mx-auto">
        {pasos.map((paso) => (
          <div
            key={paso}
            className="flex-1 flex items-center justify-center bg-[#a2a2a2] border border-[#2C3A5E] rounded-md px-6 py-10 max-h-[80px] text-center"
          >
            <p className="font-serif text-xl md:text-xl leading-snug text-[#070707]">
              {paso}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
