import React from 'react'
import Hero from './components/Hero'
import ValuePyramid from './components/ValuePyramid'
import Architecture from './components/Architecture'
import Examples from './components/Examples'
import WhyDifferent from './components/WhyDifferent'
import EnterpriseSafety from './components/EnterpriseSafety'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Hero />
      <ValuePyramid />
      <Architecture />
      <Examples />
      <WhyDifferent />
      <EnterpriseSafety />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
