import { wixClientServer } from "@/lib/wixClientServer"

const ProfilePage = async () => {
    const wixClient = wixClientServer()
  return (
    <div className="flex flex-col md:flex-row gap-24 md:h-[calc(100vh-80px)] items-center px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="w-full md:w-1/2">User</div>
        <div className="w-full md:w-1/2">Orders</div>
    </div>
  )
}

export default ProfilePage