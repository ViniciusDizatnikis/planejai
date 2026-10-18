import { CalendarClock, Goal, Sparkles, Trash2, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/shared/Button'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { calcMonthlySavings } from '@/utils/simulation'

export function HistoryPage() {
  const navigate = useNavigate()
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()

  // Lê o localStorage apenas na primeira renderização
  const [simulations, setSimulations] = useState(getAllSimulations)

  const handleDelete = (id: string) => {
    if (!window.confirm('Deseja excluir esta simulação?')) {
      return
    }

    deleteSimulation(id)
    setSimulations((current) => current.filter((item) => item.id !== id))
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Reveja suas simulações anteriores e os diagnósticos gerados pela IA."
      />

      {simulations.length === 0 ? (
        <div className="bg-card flex flex-col items-center gap-4 rounded-2xl p-10 text-center">
          <p className="text-muted-foreground text-sm">
            Você ainda não fez nenhuma simulação.
          </p>
          <Button
            variant="primary"
            icon={TrendingUp}
            onClick={() => void navigate('/')}
          >
            Fazer minha primeira simulação
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {simulations.map((simulation) => (
            <li
              key={simulation.id}
              className="bg-card flex flex-col gap-3 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-primary flex min-w-0 items-center gap-2">
                  <Goal size={16} className="shrink-0" />
                  <span className="truncate text-sm font-semibold">
                    {simulation.goalName}
                  </span>
                </div>
                {simulation.insight && (
                  <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
                    <Sparkles size={12} /> Com insight
                  </span>
                )}
              </div>

              <p className="text-foreground text-2xl font-semibold">
                R$ {simulation.goalAmount}
              </p>

              <div className="text-muted-foreground flex flex-col gap-1 text-sm">
                <span className="flex items-center gap-1">
                  <CalendarClock size={14} /> {simulation.goalDeadline} meses
                </span>
                <span>
                  Economia mensal: R${' '}
                  {calcMonthlySavings(simulation).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="mt-auto flex gap-2 pt-2">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => void navigate(`/resultado/${simulation.id}`)}
                >
                  Ver resultado
                </Button>
                <Button
                  variant="ghost"
                  icon={Trash2}
                  aria-label={`Excluir simulação ${simulation.goalName}`}
                  onClick={() => handleDelete(simulation.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
