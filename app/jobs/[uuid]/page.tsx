// app/[uuid]/page.tsx
export const dynamic = 'force-dynamic'
import Profile from './job'

export default function UserPage({ params }: { params: { uuid: string } }) {
  return <Profile uuid={params.uuid} />
}