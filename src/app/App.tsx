import { QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from '@/routes/router'
import { queryClient } from '@/app/providers'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  )
}
