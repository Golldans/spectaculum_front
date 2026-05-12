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
    title: "Escolha o alcance",
    text: "Defina um raio de busca em torno da sua regiao para filtrar opcoes realmente proximas.",
  },
  {
    step: "2",
    title: "Veja cinemas elegiveis",
    text: "O sistema lista salas ativas com distancia estimada e horarios de sessao em destaque.",
  },
  {
    step: "3",
    title: "Escolha sua proxima sessao",
    text: "Compare rapidamente e tome a decisao com base em tempo, local e formato de exibicao.",
  },
];

export const benefits = [
  {
    title: "Busca orientada por proximidade",
    text: "Resultados focados em distancia real para evitar deslocamentos longos.",
  },
  {
    title: "Leitura rapida de disponibilidade",
    text: "Horarios e detalhes essenciais em primeiro plano, sem tela poluida.",
  },
  {
    title: "Base pronta para API de mapas",
    text: "Estrutura da interface preparada para integrar dados de localizacao na proxima etapa.",
  },
  {
    title: "Experiencia clara no celular",
    text: "Layout responsivo desde o inicio para consulta rapida na rua ou em casa.",
  },
];

export const faqItems = [
  {
    question: "Ja usa geolocalizacao real?",
    answer: "Ainda nao. Esta landing apresenta o conceito e o fluxo visual inicial da plataforma.",
  },
  {
    question: "Posso escolher o raio de busca?",
    answer: "Sim. O produto foi pensado exatamente para definir o alcance da regiao e filtrar os cinemas.",
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
