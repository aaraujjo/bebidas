export default function ApoioCliente() {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Apoio ao Cliente</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Como podemos ajudar?</h2>
          <ul className="space-y-4">
            <li>
              <h3 className="font-medium">Telefone de Atendimento</h3>
              <p className="text-muted-foreground">(11) 1234-5678</p>
            </li>
            <li>
              <h3 className="font-medium">E-mail de Suporte</h3>
              <p className="text-muted-foreground">suporte@depositodebebidas.com</p>
            </li>
            <li>
              <h3 className="font-medium">Horário de Atendimento</h3>
              <p className="text-muted-foreground">Segunda a Sexta: 9h às 18h</p>
              <p className="text-muted-foreground">Sábado: 9h às 13h</p>
            </li>
          </ul>
        </div>
      </div>
    )
  }