"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/app/components/CartContext";
import { ShoppingCart } from "lucide-react";

type PizzaSize = "4 pedaços" | "8 pedaços";

interface Produto {
  id: string;
  titulo: string;
  descricao?: string;
  imagem?: string;
  tamanho?: string;
  preco?: number;
  preco4?: number;
  preco8?: number;
  categoria?: string;
}

type CartItem = {
  id: string;
  titulo: string;
  preco: number;
  quantidade: number;
  imagem: string;
  descricao?: string;
  tamanho?: PizzaSize;
};

export default function CardapioPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const router = useRouter();
  const { addItem, items } = useCart();
  const [added, setAdded] = useState<string | null>(null);

  // tamanho selecionado por pizza
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, PizzaSize>
  >({});

  useEffect(() => {
    fetch("/api/produtos")
      .then((res) => res.json())
      .then((data: Produto[]) => setProdutos(data));
  }, []);

  const buildCartItem = (produto: Produto, quantidade: number): CartItem => {
    let preco = 0;
    let tamanho: PizzaSize | undefined = undefined;

    if (produto.categoria === "pizza") {
      const selected = selectedOptions[produto.id] ?? "4 pedaços";
      preco =
        selected === "8 pedaços"
          ? Number(produto.preco8 ?? 0)
          : Number(produto.preco4 ?? 0);
      tamanho = selected;
    } else {
      preco = Number(produto.preco ?? 0);
    }

    const item: CartItem = {
      id: produto.id,
      titulo: produto.titulo,
      preco,
      quantidade,
      imagem: produto.imagem ?? "",
      descricao: produto.descricao,
    };
    if (tamanho) item.tamanho = tamanho;

    return item;
  };

  const handleComprar = (produto: Produto, quantidade = 1) => {
    const isLoggedIn =
      typeof window !== "undefined" && Boolean(localStorage.getItem("user"));

    const item = buildCartItem(produto, quantidade);

    if (!isLoggedIn) {
      try {
        localStorage.setItem("pendingCartItem", JSON.stringify(item));
      } catch {
        /* noop */
      }
      router.push("/login");
      return;
    }

    addItem(item);
    router.push("/carrinho");
  };

  const handleAdicionar = (produto: Produto, quantidade = 1) => {
    const item = buildCartItem(produto, quantidade);
    addItem(item);
    const key = produto.id + (item.tamanho ?? "");
    setAdded(key);
    setTimeout(() => setAdded(null), 1200);
  };

  return (
    <div className="p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Cardápio</h1>
        <button onClick={() => router.push("/carrinho")} className="relative">
          <ShoppingCart
            size={32}
            className="text-[var(--primary)] hover:text-[var(--details)]"
          />
          {/* Badge de quantidade */}
          <span
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              fontSize: "12px",
              minWidth: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6px",
              fontWeight: "bold",
              zIndex: 10,
            }}
          >
            {items.reduce((acc: number, item: { quantidade: number }) => acc + item.quantidade, 0)}
          </span>
        </button>
      </div>

      {/* Agrupar por categoria */}
      {["pizza", "bebida", "outros"].map((cat) => (
        <div key={cat} className="mb-10">
          <h2 className="text-xl font-bold mb-4 capitalize font-sans">
            {cat === "pizza" ? "Pizzas" : cat === "bebida" ? "Bebidas" : "Outros"}
          </h2>

          <div className="flex flex-col gap-6">
            {produtos
              .filter((p) =>
                cat === "outros"
                  ? p.categoria !== "pizza" && p.categoria !== "bebida"
                  : p.categoria === cat
              )
              .map((produto) => (
                <div
                  key={produto.id}
                  className="border rounded shadow p-4 font-sans flex flex-row items-center gap-6"
                >
                  {/* Imagem */}
                  <div className="w-40 h-32 flex-shrink-0 flex items-center justify-center">
                    {produto.imagem ? (
                      <Image
                        src={produto.imagem}
                        alt={produto.titulo}
                        width={160}
                        height={120}
                        className="object-cover rounded w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-400 font-sans">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  {/* Infos e ações */}
                  <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold font-sans mb-1">
                        {produto.titulo}
                      </h3>
                      <p className="text-gray-700 mb-1 font-sans">
                        {produto.descricao}
                      </p>

                      {produto.categoria === "pizza" ? (
                        <div className="mb-2 font-sans">
                          <div className="text-green-600 font-bold font-sans">
                            4 pedaços: R${" "}
                            {Number(produto.preco4 ?? 0).toFixed(2)}
                          </div>
                          <div className="text-green-600 font-bold font-sans">
                            8 pedaços: R${" "}
                            {Number(produto.preco8 ?? 0).toFixed(2)}
                          </div>

                          <select
                            className="border px-2 py-1 rounded font-sans mt-2"
                            value={selectedOptions[produto.id] || "4 pedaços"}
                            onChange={(e) =>
                              setSelectedOptions((prev) => ({
                                ...prev,
                                [produto.id]: e.target.value as PizzaSize,
                              }))
                            }
                          >
                            <option value="4 pedaços">4 pedaços</option>
                            <option value="8 pedaços">8 pedaços</option>
                          </select>
                        </div>
                      ) : (
                        <p className="text-green-600 font-bold mb-2 font-sans">
                          R$ {Number(produto.preco ?? 0).toFixed(2)}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button
                        onClick={() => handleComprar(produto, 1)}
                        className="bg-[var(--primary)] text-white px-4 py-2 rounded font-sans"
                      >
                        Comprar
                      </button>

                      <button
                        onClick={() => handleAdicionar(produto, 1)}
                        className={`border border-[var(--primary)] text-[var(--primary)] px-4 py-2 rounded font-sans transition ${
                          added === produto.id + (selectedOptions[produto.id] || "4 pedaços")
                            ? "bg-green-100"
                            : "bg-white"
                        }`}
                        disabled={
                          added === produto.id + (selectedOptions[produto.id] || "4 pedaços")
                        }
                      >
                        {added === produto.id + (selectedOptions[produto.id] || "4 pedaços")
                          ? "Adicionado!"
                          : "Adicionar ao carrinho"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {produtos.filter((p) =>
              cat === "outros"
                ? p.categoria !== "pizza" && p.categoria !== "bebida"
                : p.categoria === cat
            ).length === 0 && (
              <div className="text-gray-400 italic font-sans">
                Nenhum item nesta categoria.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
