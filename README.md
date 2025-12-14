Projeto: PetCare
<br>O miau cuidado para seu aumigo.</br>

Identificação dos Envolvidos
| Papel | Nome(s) |
| :--- | :--- |
| **Stakeholders** | Wesley Pecoraro, Paulo Netto |
| **Desenvolvedores** | Bleddilyn Ferreira, João Oliveira |
| **Designer** | Bleddilyn Ferreira |

<h1> Contexto </h1>

O PetCare é um aplicativo mobile que centraliza informações sobre animais disponíveis para adoção em diversas ONgs. O objetivo principal é dar visibilidade aos pets resgatados e equipar o novo tutor com recursos para gerenciar a saúde e os cuidados básicos do animal.

<h1> Funcionalidades Principais </h1>

<h2>Sistema de adoção e informação</h2>

<ul>
  <li><strong>Listagem de ONGs:</strong> Exibe as ONGs parceiras em formato de lista expansível.</li>
  <li><strong>Logos Personalizadas:</strong> As ONGs utilizam suas logos reais, carregadas de forma local (require) ou remota (URLs).</li>
  <li><strong>Detalhes do Pet (Modal Informativo):</strong> Ao clicar na foto de um pet, um Modal é aberto com: Descrição e história do animal; Status de saúde e documentação (Castrado, Microchipado, Vacinado; exibidos com ícones de status Sim/Não). </li>
</ul>

<h2>Gestão Pós-Adoção</h2>

Essa seção é crucial para o novo tutor e utiliza os dados cadastrados dos pets.

<h3>Carteira Pet Digital (Dados Cadastrais)</h3>
<ul>
  <li><strong>Registro Centralizado: :</strong> Funcionalidade que armazena os dados essenciais de cada pet que o usuário interage ou adota.</li>
  <li><strong>Dados Cadastrados:</strong> Inclui todos os dados cruciais do pet (nome, foto, status de castração, microchip, vacinas, etc.), conforme já implemetando no modal de detalhes.</li>
  <li><strong>Funcionalidade (Futura):</strong> Prepara a base para futuras integrações, como histórico de visitas ao veterinário. </li>
</ul>

<h3>Manuais de Cuidados</h3>
<ul>
  <li><strong>Acesso rápido:</strong> Uma seção dedicada a materiais informativos.</li>
  <li><strong>Conteúdo:</strong> Oferece manuais de cuidados básicos essenciais para novos tutores (por exemplo, guia de alimentação, rotina de vacinação, socialização, higiene, etc..).</li>
  <li><strong>Finalidade:</strong> Ajuda o adotante a se preparar e a cuidar adequadamente do seu novo membro da família, reduzindo as chances de devolução.</li>
</ul>

<h3>Gerenciamento de dados do usuário e UI</h3>
<ul>
  <li><strong>Login/Dados locais:</strong> Utiliza AsyncStorage para persistir dados do usuário logado (como o nome), garantindo uma experiência personalizada.</li>
  <li><strong>Header customizado:</strong> Exibição do nome do usuário logado no cabeçalho, juntamente com o botão de acesso ao menu lateral (Drawer).</li>
  <li><strong>Tipografia Customizada:</strong> Utilizada a fonte Kanit para garantir um visual coeso e profissional.</li>
</ul>

<h2>Tecnologias Utilizadas</h2>
<ul>
  <li><strong>React Native</strong> Desenvolvimento Mobile</li>
  <li><strong>Expo:</strong> Framework e ferramentas de desenvolvimento</li>
  <li><strong>@react-native-async-storage</strong>Persistência de dados locais</li>
  <li><strong>expo-font</strong>Carregamento de fontes customizadas</li>
  <li><strong>@expo/vector-icons</strong>ícones como Ionicons, AntDesign, Feather</li>
</ul>

