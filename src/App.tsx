import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ExerciseHub from './pages/ExerciseHub'
import OrientationExercise from './pages/exercises/OrientationExercise'
import FaceNameExercise from './pages/exercises/FaceNameExercise'
import MatchPairsExercise from './pages/exercises/MatchPairsExercise'
import CategorySortExercise from './pages/exercises/CategorySortExercise'
import RoutineSequenceExercise from './pages/exercises/RoutineSequenceExercise'
import PatternRepeatExercise from './pages/exercises/PatternRepeatExercise'
import NamingExercise from './pages/exercises/NamingExercise'
import OddOneOutExercise from './pages/exercises/OddOneOutExercise'
import TriviaExercise from './pages/exercises/TriviaExercise'
import Reminiscence from './pages/Reminiscence'
import Progress from './pages/Progress'
import CaregiverSettings from './pages/CaregiverSettings'
import Checkin from './pages/Checkin'

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
      <Route path="/exercises/pattern" element={<PatternRepeatExercise />} />
      <Route path="/exercises/naming" element={<NamingExercise />} />
      <Route path="/exercises/odd-one-out" element={<OddOneOutExercise />} />
      <Route path="/exercises/trivia" element={<TriviaExercise />} />
      <Route path="/reminisce" element={<Reminiscence />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/settings" element={<CaregiverSettings />} />
      <Route path="/checkin" element={<Checkin />} />
    </Routes>
  )
}
