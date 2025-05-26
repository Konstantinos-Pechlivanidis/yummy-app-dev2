import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { Camera, Pencil, LogOut } from "lucide-react";

const ProfileCard = ({ user, onEdit, onLogout }) => {
  return (
    <Card className="w-full max-w-md m-auto bg-white shadow-md px-5 py-6 rounded-2xl text-center space-y-2">
      {/* Avatar */}
      {/* <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto group">
        <img
          src={user.profileImage || "/images/default-avatar.jpg"}
          alt="Profile"
          className="w-full h-full rounded-full border-4 border-gray-200 object-cover shadow-sm group-hover:ring-2 group-hover:ring-blue-500 transition"
        />
        <label className="absolute bottom-2 right-2 bg-gray-800 text-white p-1.5 rounded-full cursor-pointer shadow-md hover:bg-gray-700 transition">
          <Camera className="w-4 h-4" />
          <input type="file" className="hidden" />
        </label>
      </div> */}

      {/* Name & Email */}
      <CardHeader className="space-y-1">
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
          {user.name}
        </CardTitle>
        <p className="text-base text-gray-500">{user.email}</p>
      </CardHeader>

      {/* Points & Actions */}
      <CardContent className="space-y-4">
        <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm sm:text-base shadow-sm">
          🎟️ Πόντοι: {user.loyaltyPoints}
          <Link to="/loyalty">
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 w-6 h-6 p-0 bg-white/20 text-white hover:bg-white/30"
            >
              ➡
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            variant="outline"
            onClick={onEdit}
            className="gap-2 justify-center text-sm sm:text-base px-4 py-2"
          >
            <Pencil className="w-4 h-4" /> Επεξεργασία
          </Button>
          <Button
            onClick={onLogout}
            className="bg-red-600 text-white hover:bg-red-700 gap-2 justify-center text-sm sm:text-base px-4 py-2"
          >
            <LogOut className="w-4 h-4" /> Αποσύνδεση
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
