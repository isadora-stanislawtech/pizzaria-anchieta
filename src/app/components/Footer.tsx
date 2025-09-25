import Image from "next/image";
import { Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[var(--details)] text-[var(--background)] p-4 flex items-center justify-between">
            <div className="flex flex-col items-start">
                <div className="flex items-center gap-4 mb-2">
                    <p>Formas de Pagamento:</p>
                    </div>
                    <Image 
                    src="/pagamento.png"
                    alt="Formas de pagamento"
                    width={300}
                    height={300}
                    className="mb-4"
                    />
            </div>
            <div className="flex flex-col items-end">
                <div className="flex items-center gap-4 mb-2">
                    <Instagram size={32}/>
                    <nav className="flex gap-4">
                        <a href="#" className="hover:underline">Termos de Uso</a>
                        <a href="#" className="hover:underline">Políticas de Privacidade</a>
                    </nav>
                </div>
                <p>© <span className="font-sans">2025</span> Anchieta Pizzaria. Todos os direitos reservados. Desenvolvido por Isadora Estanislau
                </p>
            </div>
        </footer>
    );
}