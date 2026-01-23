import { Routes, Route } from 'react-router-dom'
import { lazy } from 'react'

const Home = lazy(() => import('../scenes/Home'))
const Board3D = lazy(() => import('../scenes/Board3D'))
const LessonPlayer = lazy(() => import('../scenes/LessonPlayer'))
const DrillMode = lazy(() => import('../scenes/DrillMode'))
const Profile = lazy(() => import('../scenes/Profile'))

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/play" element={<Board3D />} />
      <Route path="/lesson/:lessonId" element={<LessonPlayer />} />
      <Route path="/drills" element={<DrillMode />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}
