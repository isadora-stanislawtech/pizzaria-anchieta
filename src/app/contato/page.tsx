import Image from 'next/image'
import { PhoneCallIcon, PinIcon, MailIcon } from 'lucide-react'


export default async function Contato() {
  return (
    <main className="flex flex-col items-center justify-between">
      <div className="relative w-full flex flex-col min-h-[600px]">
        <Image
          src="/hero.png"
          alt="Aquarela de uma cidade da Itália"
          fill
          className="object-cover w-full h-full z-0"
          style={{ objectPosition: "top" }}
        />
        <h1 className="text-5xl font-title text-[var(--details)] z-10 items-start ml-20">
          ENTRE EM CONTATO CONOSCO
        </h1>
        <p className="text-2xl z-10 mb-10 items-start ml-20">
          Estamos à disposição para esclarecer suas dúvidas e receber seu pedido.
        </p>
        <div className="flex justify-between w-full px-20 gap-8 z-10">
          <div className="flex flex-col bg-white p-6 rounded-2xl shadow-lg flex-1">
            <div className="flex items-center gap-3 mb-2 text-[var(--details)]">
              <PhoneCallIcon size={36} />
              <h2 className="text-2xl font-semibold">Telefone</h2>
            </div>
            <p className="font-sans text-xl">(11) 1234-5678</p>
          </div>
          <div className="flex flex-col bg-white p-6 rounded-2xl shadow-lg flex-1">
            <div className="flex items-center gap-3 mb-2 text-[var(--details)]">
              <MailIcon size={36} />
              <h2 className="text-2xl font-semibold">Email</h2>
            </div>
            <p className="text-xl">atendimento@anchietapizzaria.com</p>
          </div>
          <div className="flex flex-col bg-white p-6 rounded-2xl shadow-lg flex-1">
            <div className="flex items-center gap-3 mb-2 text-[var(--details)]">
              <PinIcon size={36} />
              <h2 className="text-2xl font-semibold">Endereço</h2>
            </div>
            <p className="text-xl">Av. Odila Azalim, <span className="font-sans">575</span> - Jundiaí/SP</p>
          </div>
        </div>
        <div className="w-full px-20 mt-10 z-10 mb-10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.804596030432!2d-46.89466472485337!3d-23.213790779040234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf26b3611bfde1%3A0xca0eb3ae8f5f8407!2sUniAnchieta!5e0!3m2!1spt-BR!2sbr!4v1756513947171!5m2!1spt-BR!2sbr"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </main>
  )
}
