import Image from "next/image"

export default function SobreNos() {
  return (
    <main className="flex flex-col items-center justify-between">
      <section className="w-full px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-title text-[var(--details)] mb-6">
              SOBRE NÓS
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-[var(--foreground)]">
              A Anchieta Pizzaria nasceu da paixão por receitas artesanais e pela hospitalidade.
              Nossa massa é preparada diariamente com fermentação lenta, garantindo leveza e sabor
              inconfundível. Selecionamos ingredientes frescos e valorizamos fornecedores locais,
              mantendo a tradição italiana com um toque brasileiro. Aqui, cada pizza é montada com
              cuidado e assada em alta temperatura para alcançar bordas crocantes, centro suculento
              e aromas que abraçam a memória afetiva de quem prova. Mais do que um pedido, queremos
              oferecer uma experiência: atendimento gentil, ambiente acolhedor e um cardápio que
              respeita preferências e restrições, sem abrir mão do sabor. Seja para celebrar ou
              para o dia a dia, você é sempre bem-vindo na Anchieta.
            </p>
          </div>
          <div className="relative h-[520px] md:h-[600px]">
            <div className="absolute top-4 left-24">
              <Image
                src="/icon-1.png"
                alt="Ingrediente 1"
                width={180}
                height={180}
                className="drop-shadow-xl rotate-[-6deg] select-none pointer-events-none"
                priority
              />
            </div>
            <div className="absolute top-32 right-24">
              <Image
                src="/icon-2.png"
                alt="Ingrediente 2"
                width={200}
                height={200}
                className="drop-shadow-xl rotate-[5deg] select-none pointer-events-none"
              />
            </div>
            <div className="absolute top-64 left-36">
              <Image
                src="/icon-3.png"
                alt="Ingrediente 3"
                width={170}
                height={170}
                className="drop-shadow-xl rotate-[-2deg] select-none pointer-events-none"
              />
            </div>
            <div className="absolute bottom-4 right-12">
              <Image
                src="/icon-4.png"
                alt="Ingrediente 4"
                width={190}
                height={190}
                className="drop-shadow-xl rotate-[8deg] select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
