'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, X, Instagram, Phone, Search, User, Plus, Minus, HelpCircle, MapPin, CreditCard, QrCode, CheckCircle, Truck, Wine, LogOut, UserCircle, ClipboardList, HeadphonesIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Image from 'next/image'
import Link from 'next/link'
import ApoioCliente from './apoio-cliente'
import LocalizacaoLoja from './localizacao-loja'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Tipo para os produtos
type Product = {
  id: number
  name: string
  price: number
  image: string
  category: string
}

// Tipo para os itens do carrinho
type CartItem = Product & { quantity: number }

// Produtos mock
const products: Product[] = [
  { id: 1, name: 'Cerveja Pilsen', price: 3.5, image: 'https://mercantilatacado.vtexassets.com/arquivos/ids/168460/65391b486a2a15a1bb6c1b73.jpg?v=638338381577370000', category: 'Cervejas' },
  { id: 2, name: 'Refrigerante Cola', price: 5, image: 'https://www.arenaatacado.com.br/on/demandware.static/-/Sites-storefront-catalog-sv/default/dw083f84b4/Produtos/994138-7896186300163-refrigerante%20xereta%20cola%20pet%202l-xereta-1.jpg', category: 'Refrigerantes' },
  { id: 3, name: 'Água Mineral', price: 2, image: 'https://drogariamoderna.vtexassets.com/arquivos/ids/251997-800-auto?v=638151218022670000&width=800&height=auto&aspect=true', category: 'Águas' },
  { id: 4, name: 'Suco de Laranja', price: 4.5, image: 'https://mambodelivery.vtexassets.com/arquivos/ids/182083/suco-de-laranja-integral-prats-900ml.jpg?v=637883964153570000', category: 'Sucos' },
  { id: 5, name: 'Vinho Tinto', price: 25, image: 'https://www.vinicolacampestre.com.br/wp-content/uploads/2019/02/750-Tinto-Suave-2023.png', category: 'Vinhos' },
  { id: 6, name: 'Energético', price: 7, image: 'https://drogariasp.vteximg.com.br/arquivos/ids/677450-1000-1000/3204---energetico-red-bull-energy-drink-250ml.jpg?v=637908227857370000', category: 'Energéticos' },
]

export default function Main() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCheckout, setIsCheckout] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    Object.fromEntries(products.map(p => [p.id, 1]))
  )
  const [currentPage, setCurrentPage] = useState('home')
  const [deliveryProgress, setDeliveryProgress] = useState(0)
  const [deliveryStatus, setDeliveryStatus] = useState('Preparando seu pedido')
  const [deliveryLocation, setDeliveryLocation] = useState({ lat: -23.550520, lng: -46.633309 }) // São Paulo coordinates
  const [deliveryDistance, setDeliveryDistance] = useState(2); // Inicialmente definido como 2km

  const calculateDeliveryFee = (distance: number) => {
    const baseFee = 5; // Taxa mínima de 5 reais
    const additionalFeePerKm = 2; // 2 reais por km adicional após 3km
    if (distance <= 3) {
      return baseFee;
    }
    return baseFee + (distance - 3) * additionalFeePerKm;
  };

  const calculateTotal = (cartTotal: number, distance: number) => {
    return cartTotal + calculateDeliveryFee(distance);
  };

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id]
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id)
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...currentCart, { ...product, quantity }]
    })
    setQuantities(prev => ({ ...prev, [product.id]: 1 })) // Reset quantity after adding to cart
  }

  const removeFromCart = (id: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePayment = () => {
    // Simular processamento de pagamento
    setTimeout(() => {
      setIsPaid(true);
      // Iniciar simulação de entrega
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setDeliveryProgress(progress);
        updateDeliveryStatus(progress);
        // Simular mudança na distância
        setDeliveryDistance(prev => Math.min(10, prev + 0.5)); // Aumenta a distância gradualmente até 10km
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 2000); // Atualiza a cada 2 segundos
    }, 2000); // Simula 2 segundos de processamento
  };

  const updateDeliveryStatus = (progress: number) => {
    if (progress < 20) {
      setDeliveryStatus('Preparando seu pedido')
    } else if (progress < 40) {
      setDeliveryStatus('Pedido saiu para entrega')
    } else if (progress < 60) {
      setDeliveryStatus('Entregador a caminho')
    } else if (progress < 80) {
      setDeliveryStatus('Entregador próximo ao destino')
    } else if (progress < 100) {
      setDeliveryStatus('Entregando seu pedido')
    } else {
      setDeliveryStatus('Pedido entregue')
    }

    // Simular movimento do entregador
    setDeliveryLocation(prev => ({
      lat: prev.lat + (Math.random() - 0.5) * 0.01,
      lng: prev.lng + (Math.random() - 0.5) * 0.01
    }))
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'apoio':
        return <ApoioCliente />
      case 'localizacao':
        return <LocalizacaoLoja />
      default:
        return (
          <>
            <h2 className="text-3xl font-bold mb-6">Nossos Produtos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {filteredProducts.map(product => (
                <Card key={product.id} className="flex flex-col bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-4 flex-grow">
                    <div className="aspect-square relative mb-4">
                      <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-md p-1 flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setQuantities(prev => ({ ...prev, [product.id]: Math.max(1, prev[product.id] - 1) }))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold">{quantities[product.id]}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setQuantities(prev => ({ ...prev, [product.id]: prev[product.id] + 1 }))}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="mb-2">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    <p className="text-lg font-semibold">R$ {product.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => addToCart(product)} className="w-full">
                      Adicionar ao Carrinho
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Barra de navegação */}
      <nav className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2" onClick={() => setCurrentPage('home')}>
            <Wine className="h-6 w-6" />
            Depósito de Bebidas
          </Link>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="pl-8 pr-4 py-2 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>Meus Pedidos</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Desconectar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <main className="flex-grow container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10"></div>
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Depósito de Bebidas. Todos os direitos reservados.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="https://www.instagram.com/sua_loja" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-foreground">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="https://wa.me/seu_numero" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-foreground">
              <Phone className="h-6 w-6" />
            </a>
            <Button variant="ghost" size="icon" onClick={() => setCurrentPage('apoio')} className="text-primary hover:text-primary-foreground">
              <HeadphonesIcon className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setCurrentPage('localizacao')} className="text-primary hover:text-primary-foreground">
              <MapPin className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </footer>

      {/* Carrinho e Checkout */}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-4 right-4 h-16 w-16 rounded-full">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">
                {totalItems}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{isPaid ? 'Acompanhamento do Pedido' : (isCheckout ? 'Checkout' : 'Seu Carrinho')}</SheetTitle>
          </SheetHeader>
          {isPaid ? (
            <div className="mt-8 space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Pagamento Confirmado!</AlertTitle>
                <AlertDescription>
                  Seu pedido foi processado com sucesso e está a caminho.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <h4 className="font-semibold">Status da Entrega</h4>
                <Progress value={deliveryProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  {deliveryStatus}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Localização do Entregador</h4>
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${deliveryLocation.lng},${deliveryLocation.lat})/${deliveryLocation.lng},${deliveryLocation.lat},13,0/600x400@2x?access_token=YOUR_MAPBOX_ACCESS_TOKEN`}
                    alt="Mapa de entrega"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Latitude: {deliveryLocation.lat.toFixed(6)}, Longitude: {deliveryLocation.lng.toFixed(6)}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Detalhes do Pedido</h4>
                <ul className="space-y-1">
                  {cart.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Subtotal:</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taxa de entrega ({deliveryDistance.toFixed(1)}km):</span>
                    <span>R$ {calculateDeliveryFee(deliveryDistance).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span>R$ {calculateTotal(totalPrice, deliveryDistance).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : !isCheckout ? (
            <>
              {cart.length === 0 ? (
                <p className="text-center mt-8">Seu carrinho está vazio</p>
              ) : (
                <div className="mt-8 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p>R$ {item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Separator className="my-4" />
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxa de entrega ({deliveryDistance.toFixed(1)}km):</span>
                  <span>R$ {calculateDeliveryFee(deliveryDistance).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span>Total:</span>
                  <span>R$ {calculateTotal(totalPrice, deliveryDistance).toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={() => setIsCheckout(true)}
                className="w-full"
                disabled={cart.length === 0}
              >
                Finalizar Compra
              </Button>
            </>
          ) : (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Informações de Pagamento</h3>
              <Tabs defaultValue="credit-card" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="credit-card">Cartão de Crédito</TabsTrigger>
                  <TabsTrigger value="pix">PIX</TabsTrigger>
                </TabsList>
                <TabsContent value="credit-card">
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-4">
                        <Label htmlFor="card-number">Número do Cartão</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" className="font-mono" />
                      </div>
                      <div className="col-span-3">
                        <Label htmlFor="card-name">Nome no Cartão</Label>
                        <Input id="card-name" placeholder="NOME COMPLETO" className="uppercase" />
                      </div>
                      <div>
                        <Label htmlFor="expiry-date">Validade</Label>
                        <Input id="expiry-date" placeholder="MM/AA" className="font-mono" />
                      </div>
                      <div className="col-span-3">
                        <Label htmlFor="card-brand">Bandeira</Label>
                        <Select>
                          <SelectTrigger id="card-brand">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visa">Visa</SelectItem>
                            <SelectItem value="mastercard">Mastercard</SelectItem>
                            <SelectItem value="amex">American Express</SelectItem>
                            <SelectItem value="elo">Elo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" className="font-mono" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">Pagar com Cartão de Crédito</Button>
                  </form>
                </TabsContent>
                <TabsContent value="pix">
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center">
                      <QrCode className="w-32 h-32" />
                    </div>
                    <p className="text-center">Escaneie o QR Code acima com o seu aplicativo de banco para pagar via PIX.</p>
                    <Button className="w-full" onClick={handlePayment}>Simular Pagamento PIX</Button>
                  </div>
                </TabsContent>
              </Tabs>
              <Button onClick={() => setIsCheckout(false)} variant="outline" className="w-full mt-4">
                Voltar para o Carrinho
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}