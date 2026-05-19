export type CinemaPreview = {
  name: string;
  distance: string;
  city: string;
  sessions: string;
};

export const cinemaPreviews: CinemaPreview[] = [
  {
    name: "Cine Aurora",
    distance: "1.2 km",
    city: "Centro",
    sessions: "14:10, 16:40, 19:30",
  },
  {
    name: "Mirage IMAX",
    distance: "2.8 km",
    city: "Zona Norte",
    sessions: "13:20, 18:00, 21:15",
  },
  {
    name: "Sala Horizonte",
    distance: "3.6 km",
    city: "Bela Vista",
    sessions: "15:00, 17:45, 20:50",
  },
];

export const howItWorksItems = [
  {
    step: "1",
    title: "Descubra filmes",
    text: "Busque e explore filmes com metadados ricos da integração OMDb: sinopse, ano, IMDb ID e capas de alta qualidade.",
  },
  {
    step: "2",
    title: "Avalie e comente",
    text: "Compartilhe sua opinião com avaliações de estrelas (inclui meia estrela) e comentários nomeados com outros cinéfilos.",
  },
  {
    step: "3",
    title: "Conecte-se e organize",
    text: "Envie pedidos de amizade, crie listas colaborativas, receba notificações de sessões em cinemas e construa sua rede de cinéfilos.",
  },
];

export const benefits = [
  {
    title: "Metadados ricos com OMDb",
    text: "Acesso a dados completos de filmes incluindo sinopse, ano de lançamento, IMDb ID e capas oficiais.",
  },
  {
    title: "Avaliações precisas com meia-estrela",
    text: "Sistema de rating granular que permite expressar sua opinião de forma mais precisa e exata.",
  },
  {
    title: "Cinemas validados por CEP",
    text: "Cadastro de cinemas com validação automática de endereço via ViaCEP. Endereços estruturados e confiáveis.",
  },
  {
    title: "Notificações em tempo real",
    text: "Receba alertas quando filmes da sua watchlist entram em sessão em cinemas cadastrados. Nunca perca uma oportunidade.",
  },
  {
    title: "Rede social de cinéfilos",
    text: "Sistema de amizade com solicitações, listas colaborativas e comentários para conectar com outros fãs de cinema.",
  },
  {Como funciona a busca de filmes?",
    answer: "Utilize o campo de busca para encontrar filmes no OMDb. Você pode filtrar por ano para resultados mais precisos. Cada filme traz metadados completos incluindo sinopse e IMDb ID.",
  },
  {
    question: "Como recebo notificações de sessões?",
    answer: "Adicione filmes à sua watchlist clicando no botão de coração. Quando um cinema cadastrar uma sessão para um filme da sua watchlist, você receberá uma notificação no sino da navbar.",
  },
  {
    question: "Como funcionam as avaliações?",
    answer: "Cada filme pode receber avaliações de estrelas (com suporte a meia-estrela) de qualquer usuário. A média das avaliações aparece na página do filme para ajudar na decisão.",
  },
  {
    question: "Como adiciono um cinema?",
    answer: "Vá até a página de cinemas e use o formulário de cadastro. Insira o CEP e o sistema busca automaticamente o endereço via ViaCEP. Você também pode agendar sessões de filmes nos cinemas.",
  },
  {
    question: "Como funcionam as listas colaborativas?",
    answer: "Crie listas personalizadas de filmes. Você pode adicionar/remover filmes, deixar comentários e avaliações. Outras pessoas podem comentar em suas listas públicas.",
  },
  {
    question: "Como funciona o sistema de amigos?",
    answer: "Busque outros usuários e envie pedidos de amizade. O outro usuário pode aceitar ou rejeitar o pedido. Quando aceito, você vê a lista de filmes e recomendações do seu amigoemas.",
  },
  {
    question: "Vai integrar com API do Google?",
    answer: "Sim, esta na proxima fase do projeto para alimentar os resultados com dados reais.",
  },
  {
    question: "Funciona no celular?",
    answer: "O layout atual ja foi estruturado para adaptar em mobile e desktop sem perda de leitura.",
  },
];
