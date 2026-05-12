# Spectaculum - Landing Preview

Este arquivo serve como preview estático da landing page enquanto o projeto não pode ser executado localmente.

## Hero

**Seu radar de cinema local**

# Encontre cinemas perto de voce em segundos.

O Spectaculum ajuda voce a definir um alcance na sua regiao e descobrir opcoes de cinema por proximidade, horario e tipo de sala.

[ACTION] Encontrar cinemas proximos
[ACTION] Ver como funciona

### Preview na sua regiao

- Cine Aurora - 1.2 km
- Mirage IMAX - 2.8 km
- Sala Horizonte - 3.6 km

---

## Como funciona

1. **Escolha o alcance**
   Defina um raio de busca em torno da sua regiao para filtrar opcoes realmente proximas.
2. **Veja cinemas elegiveis**
   O sistema lista salas ativas com distancia estimada e horarios de sessao em destaque.
3. **Escolha sua proxima sessao**
   Compare rapidamente e tome a decisao com base em tempo, local e formato de exibicao.

---

## Por que usar o Spectaculum

- **Busca orientada por proximidade**
  Resultados focados em distancia real para evitar deslocamentos longos.
- **Leitura rapida de disponibilidade**
  Horarios e detalhes essenciais em primeiro plano, sem tela poluida.
- **Base pronta para API de mapas**
  Estrutura da interface preparada para integrar dados de localizacao na proxima etapa.
- **Experiencia clara no celular**
  Layout responsivo desde o inicio para consulta rapida na rua ou em casa.

---

## Mock de cinemas proximos

### Cine Aurora (1.2 km)
Centro - Salas e formatos variados - Sessoes: 14:10, 16:40, 19:30  
Tag: Mais proximo

### Mirage IMAX (2.8 km)
Zona Norte - Salas e formatos variados - Sessoes: 13:20, 18:00, 21:15  
Tag: Alta demanda

### Sala Horizonte (3.6 km)
Bela Vista - Salas e formatos variados - Sessoes: 15:00, 17:45, 20:50  
Tag: Conforto premium

---

## FAQ rapido

### Ja usa geolocalizacao real?
Ainda nao. Esta landing apresenta o conceito e o fluxo visual inicial da plataforma.

### Posso escolher o raio de busca?
Sim. O produto foi pensado exatamente para definir o alcance da regiao e filtrar os cinemas.

### Vai integrar com API do Google?
Sim, esta na proxima fase do projeto para alimentar os resultados com dados reais.

### Funciona no celular?
O layout atual ja foi estruturado para adaptar em mobile e desktop sem perda de leitura.

---

## Footer

2026 Spectaculum. Descubra seu proximo cinema.

Links:
- Sobre
- Contato
- Privacidade

---

## Mapa de componentes implementados

- app/components/landing/LandingPage.tsx
- app/components/landing/sections/HeroSection.tsx
- app/components/landing/sections/HowItWorksSection.tsx
- app/components/landing/sections/BenefitsSection.tsx
- app/components/landing/sections/NearbyCinemasSection.tsx
- app/components/landing/sections/FaqSection.tsx
- app/components/landing/ui/Buttons.tsx
- app/components/landing/ui/Card.tsx
- app/components/landing/ui/SectionBlock.tsx
- app/components/landing/data.ts
- app/components/landing/styles.ts
