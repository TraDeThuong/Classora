
export default function Logo() {
  return (

    <div className="text-2xl font-bold text-brand-200 flex flex-row items-center gap-6 ">
        <img
            src = {"/logo.png"}
            className="block h-20 w-20 rounded-full object-cover object-center hover:rotate-8"/>
        Classora
    </div>
  )
}
