import Image from 'next/image'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center'>
      <Image src="/undraw_page_not_found.svg" alt="Page not found" width={600} height={600} />
      <Link href="/" className='text-violet-600 mt-4'>Return Home</Link>
    </div>
  )
}