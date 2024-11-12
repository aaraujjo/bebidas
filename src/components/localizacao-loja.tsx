export default function LocalizacaoLoja() {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Localização da Loja</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Nosso Endereço</h2>
          <ul className="space-y-4">
            <li>
              <h3 className="font-medium">Endereço</h3>
              <p className="text-muted-foreground">Rua das Bebidas, 123</p>
              <p className="text-muted-foreground">Bairro: Centro</p>
              <p className="text-muted-foreground">Cidade: São Paulo - SP</p>
            </li>
            <li>
              <h3 className="font-medium">Telefone</h3>
              <p className="text-muted-foreground">(11) 9876-5432</p>
            </li>
            <li>
              <h3 className="font-medium">Horário de Funcionamento</h3>
              <p className="text-muted-foreground">Segunda a Sábado: 9h às 22h</p>
              <p className="text-muted-foreground">Domingo: 10h às 20h</p>
            </li>
          </ul>
        </div>
      </div>
    )
  }