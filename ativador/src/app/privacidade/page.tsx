import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidade — Ativador de Produto",
  description: "Como coletamos, usamos e protegemos seus dados no Ativador Automático de Produtos Virais.",
}

export default function Privacidade() {
  return (
    <main className="min-h-screen bg-[#0b0b12] text-slate-200">
      <div className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="text-3xl font-bold text-white">Política de Privacidade</h1>
        <p className="mt-2 text-sm text-slate-400">Última atualização: 28 de setembro de 2026</p>

        <div className="mt-8 space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white">1. O que é este site</h2>
            <p className="mt-2">
              O Ativador Automático de Produtos Virais é uma ferramenta que ajuda você a criar
              produtos digitais (conteúdo, páginas de vendas e materiais) de forma rápida com o
              auxílio de inteligência artificial.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. Quais dados coletamos</h2>
            <p className="mt-2">Coletamos apenas o necessário para o funcionamento:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-300">
              <li><strong>Login com Google:</strong> seu nome e seu e-mail da conta Google, usados apenas para identificar você e liberar o acesso.</li>
              <li><strong>Conteúdo que você escreve:</strong> as ideias, títulos e textos que você digita para gerar seu produto, usados para gerar as peças pedidas.</li>
              <li><strong>Dados técnicos básicos:</strong> informações do navegador e do acesso, para segurança e correção de erros.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Como usamos seus dados</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-300">
              <li>Permitir seu login e manter sua sessão ativa (por até 30 dias).</li>
              <li>Gerar o produto digital que você pediu, com ajuda de inteligência artificial.</li>
              <li>Salvar temporariamente o material gerado para você continuar editando.</li>
            </ul>
            <p className="mt-2">
              <strong>Não vendemos, não alugamos e não compartilhamos seus dados com terceiros para
              fins de publicidade.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Inteligência artificial</h2>
            <p className="mt-2">
              Para gerar textos e estruturas usamos um serviço de inteligência artificial. Seu texto é
              enviado apenas no momento da geração e não é usado para treinar modelos. Ferramentas de
              terceiros seguem as próprias políticas de privacidade.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">5. Publicação de páginas</h2>
            <p className="mt-2">
              Quando você publica uma página, ela passa a ter um endereço público na internet e pode
              ser vista por qualquer pessoa. Revise o conteúdo antes de compartilhar o link.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">6. Cookies</h2>
            <p className="mt-2">
              Usamos um cookie de sessão (para lembrar que você está logado) e cookies estritamente
              necessários ao funcionamento do site. Não usamos cookies de rastreamento de
              publicidade.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">7. Retenção e exclusão</h2>
            <p className="mt-2">
              Guardamos suas informações enquanto sua conta estiver ativa. Você pode pedir a exclusão
              dos seus dados a qualquer momento pelo e-mail abaixo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">8. Direitos do titular (LGPD)</h2>
            <p className="mt-2">
              Você tem direito de acessar, corrigir, portar ou excluir seus dados. Para exercer esses
              direitos, basta enviar um e-mail pedindo o que precisa.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">9. Contato</h2>
            <p className="mt-2">
              Dúvidas sobre privacidade: <strong>mentorajanesantana@gmail.com</strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">10. Alterações</h2>
            <p className="mt-2">
              Podemos atualizar esta política. A data no topo sempre indica a versão vigente.
            </p>
          </section>
        </div>

        <a href="/" className="mt-10 inline-block text-sm text-indigo-400 hover:text-indigo-300">
          ← Voltar para o início
        </a>
      </div>
    </main>
  )
}
