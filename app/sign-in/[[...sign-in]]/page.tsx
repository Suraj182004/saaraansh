import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className='flex justify-center items-center lg:min-h-[40vh] bg-white dark:bg-gray-950 py-12'>
      <div className='py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12'>
        <SignIn appearance={{
          variables: {
            colorPrimary: 'rgb(79, 70, 229)',
            colorBackground: 'auto',
            colorText: 'auto',
            colorTextSecondary: 'auto',
          }
        }} />
      </div>
    </section>
  );
}