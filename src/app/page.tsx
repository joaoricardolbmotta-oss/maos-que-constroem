import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="font-semibold text-slate-900">Mãos que Constroem</span>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Área Administrativa
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Transparência com
            <span className="text-blue-600"> Responsabilidade</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Acompanhe campanhas de arrecadação com total transparência. Veja onde cada doação vai e como está
            sendo utilizada.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/campanha/acao-01"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Campanhas Ativas
            </Link>
            <a
              href="#sobre"
              className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Saiba Mais
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="sobre" className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Por que escolher esta plataforma?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border border-slate-200 rounded-lg">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Transparência Total</h3>
              <p className="text-slate-600">
                Veja todas as receitas, despesas e doações com informações públicas mascaradas para privacidade.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border border-slate-200 rounded-lg">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Comprovantes Públicos</h3>
              <p className="text-slate-600">
                Acesse comprovantes de receitas e despesas para validar como o dinheiro foi utilizado.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border border-slate-200 rounded-lg">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Dados Protegidos</h3>
              <p className="text-slate-600">
                Dados pessoais são mascarados automaticamente. CPF, nomes e informações sensíveis são protegidas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Comece a Acompanhar</h2>
          <p className="mb-6 text-blue-100">Acesse as campanhas ativas e veja como está a arrecadação</p>
          <Link
            href="/campanha/acao-01"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Ver Campanhas →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="font-semibold text-white">Instituto Joanna de Ângelis</p>
              <p className="text-sm">Transparência e Responsabilidade Social</p>
            </div>
            <div className="text-sm">
              © 2024 Mãos que Constroem. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
