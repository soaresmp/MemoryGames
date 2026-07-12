import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ExerciseHub from './pages/ExerciseHub'
import OrientationExercise from './pages/exercises/OrientationExercise'
import FaceNameExercise from './pages/exercises/FaceNameExercise'
import MatchPairsExercise from './pages/exercises/MatchPairsExercise'
import CategorySortExercise from './pages/exercises/CategorySortExercise'
import RoutineSequenceExercise from './pages/exercises/RoutineSequenceExercise'
import Reminiscence from './pages/Reminiscence'
import Progress from './pages/Progress'
import CaregiverSettings from './pages/CaregiverSettings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/today" element={<OrientationExercise />} />
      <Route path="/exercises" element={<ExerciseHub />} />
      <Route path="/exercises/orientation" element={<OrientationExercise />} />
      <Route path="/exercises/faces" element={<FaceNameExercise />} />
      <Route path="/exercises/match" element={<MatchPairsExercise />} />
      <Route path="/exercises/sort" element={<CategorySortExercise />} />
      <Route path="/exercises/routine" element={<RoutineSequenceExercise />} />
      <Route path="/reminisce" element={<Reminiscence />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/settings" element={<CaregiverSettings />} />
    </Routes>
  )
}
