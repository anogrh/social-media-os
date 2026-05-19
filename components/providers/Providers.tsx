'use client'

import { ClientsProvider } from '@/context/ClientsContext'
import { TasksProvider } from '@/context/TasksContext'
import { PaymentsProvider } from '@/context/PaymentsContext'
import { CalendarProvider } from '@/context/CalendarContext'
import { ContractsProvider } from '@/context/ContractsContext'
import { PromptsProvider } from '@/context/PromptsContext'
import { ReferencesProvider } from '@/context/ReferencesContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClientsProvider>
      <TasksProvider>
        <PaymentsProvider>
          <CalendarProvider>
            <ContractsProvider>
              <PromptsProvider>
                <ReferencesProvider>
                  {children}
                </ReferencesProvider>
              </PromptsProvider>
            </ContractsProvider>
          </CalendarProvider>
        </PaymentsProvider>
      </TasksProvider>
    </ClientsProvider>
  )
}
