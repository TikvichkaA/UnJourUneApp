import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Referentiel from './pages/Referentiel'
import CompetenceDetail from './pages/CompetenceDetail'
import Normes from './pages/Normes'
import NormeDetail from './pages/NormeDetail'
import Quiz from './pages/Quiz'
import QuizSession from './pages/QuizSession'
import Calculateurs from './pages/Calculateurs'
import Habilitations from './pages/Habilitations'
import HabilitationDetail from './pages/HabilitationDetail'
import CourantsFaibles from './pages/CourantsFaibles'
import CourantsFaiblesDetail from './pages/CourantsFaiblesDetail'
import Symboles from './pages/Symboles'
import SymbolesFlashcards from './pages/SymbolesFlashcards'
import Raccordements from './pages/Raccordements'
import RaccordementGame from './pages/RaccordementGame'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="referentiel" element={<Referentiel />} />
        <Route path="referentiel/:competenceId" element={<CompetenceDetail />} />
        <Route path="normes" element={<Normes />} />
        <Route path="normes/:normeId" element={<NormeDetail />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="quiz/:category" element={<QuizSession />} />
        <Route path="calculateurs" element={<Calculateurs />} />
        <Route path="habilitations" element={<Habilitations />} />
        <Route path="habilitations/:habId" element={<HabilitationDetail />} />
        <Route path="courants-faibles" element={<CourantsFaibles />} />
        <Route path="courants-faibles/:categoryId" element={<CourantsFaiblesDetail />} />
        <Route path="symboles" element={<Symboles />} />
        <Route path="symboles/:category" element={<SymbolesFlashcards />} />
        <Route path="raccordements" element={<Raccordements />} />
        <Route path="raccordements/:circuitId" element={<RaccordementGame />} />
      </Route>
    </Routes>
  )
}

export default App
