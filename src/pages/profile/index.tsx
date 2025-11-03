/**
 * Profile Page
 * User profile management and information display
 */

const ProfilePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex items-center mb-6">
          <svg className="w-8 h-8 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-gray-200"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
              <p className="text-gray-600">john.doe@example.com</p>
              <p className="text-sm text-gray-500 mt-1">Member since January 2024</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
              <p className="text-sm text-gray-600">Manage your account details and preferences.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Activity Summary</h3>
              <p className="text-sm text-gray-600">View your recent activity and statistics.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;