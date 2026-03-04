export default function Login() {
    return (
        <div className="bg-[#f4f4f4] p-15 size-100 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4 text-[#172b4d]">Login</h2>
            <form className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" placeholder="example@gmail.com" className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" placeholder="your password" className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <button type="submit" className="w-full bg-[#1868db] text-white py-2 px-4 rounded-md hover:bg-[#1557b0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
            </form>
            <p className="mt-4 text-gray-700">Dont have an account? <a href="#" className=" text-[#1868db] hover:underline">Sign up</a></p>
        </div>
    )
}