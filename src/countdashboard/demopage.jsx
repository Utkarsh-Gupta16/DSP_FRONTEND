import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Globe, Video } from "lucide-react";
import axios from "axios";

// Set axios base URL
const api = axios.create({
  baseURL: "http://localhost:5000",
});

const DemoPage = () => {
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [date, setDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookingStatus, setBookingStatus] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setSelectedTimezone(userTimeZone);

      const fetchUserInfo = async () => {
        try {
          const token = localStorage.getItem("token");
          const storedUser = localStorage.getItem("user");

          if (storedUser) {
            console.log("Using stored user data:", storedUser);
            setUserInfo(JSON.parse(storedUser));
            return;
          }

          if (!token) {
            console.log("No token found in localStorage");
            return;
          }
          console.log("Fetching user info with token:", token);
          const response = await api.get("/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("User info fetched:", response.data);
          setUserInfo(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          console.error("Failed to fetch user info:", error.response?.data || error.message);
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            console.log("Invalid token, cleared from localStorage");
          }
        }
      };

      fetchUserInfo();
    } catch (e) {
      console.error("Error in useEffect:", e);
      setSelectedTimezone("America/New_York");
    }
  }, []);

  useEffect(() => {
    generateTimeSlots();
  }, [date, selectedTimezone]);

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 10;
    const startMinute = 30;
    const endHour = 17;
    const endMinute = 30;
    const intervalHours = 1;

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
      const formattedHour = currentHour.toString().padStart(2, "0");
      const formattedMinute = currentMinute.toString().padStart(2, "0");

      const nextHour = (currentHour + intervalHours) % 24;
      const formattedNextHour = nextHour.toString().padStart(2, "0");

      const timeSlot = {
        id: `${formattedHour}${formattedMinute}`,
        startTime: `${formattedHour}:${formattedMinute}`,
        endTime: `${formattedNextHour}:${formattedMinute}`,
        label: `${formattedHour}:${formattedMinute} - ${formattedNextHour}:${formattedMinute}`,
      };

      slots.push(timeSlot);

      currentHour += intervalHours;
    }

    setTimeSlots(slots);
  };

  const handleBookDemo = async () => {
    if (!selectedTimeSlot) {
      setBookingStatus({
        message: "Please select a time slot",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token || !userInfo) {
        setBookingStatus({
          message: "Please log in to book a demo",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      // Combine date and timeSlot into a single Date object
      const [hours, minutes] = timeSlots.find(slot => slot.id === selectedTimeSlot).startTime.split(':');
      const demoDate = new Date(date);
      demoDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const bookingData = {
        name: userInfo.name,
        email: userInfo.email,
        date: demoDate.toISOString(),
        message: `Demo request for ${formatDate(date)} at ${timeSlots.find(slot => slot.id === selectedTimeSlot).label} (${selectedTimezone})`,
      };

      const response = await api.post("/api/demo", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookingStatus({
        message: "Demo request submitted successfully!",
        type: "success",
      });

      setSelectedTimeSlot("");
    } catch (error) {
        console.error("Failed to book demo:", error.response?.data || error);
        setBookingStatus({
          message: error.response?.data?.message || "Failed to book demo. Please try again.",
          type: "error",
        });
      } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserInfo(null);
    setBookingStatus({ message: "", type: "" });
    console.log("User logged out");
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const isPastDate = (day) => {
    const checkDate = new Date(year, month, day);
    return checkDate <= todayDate;
  };

  const isWeekend = (day) => {
    const dayOfWeek = new Date(year, month, day).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isToday = (day) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];
    const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

    const weekdayHeaders = weekdays.map((day) => (
      <div key={day} className="text-sm font-medium text-gray-500 text-center py-2">
        {day}
      </div>
    ));

    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled = isPastDate(day) || isWeekend(day);
      const selected = day === date.getDate() && month === date.getMonth() && year === date.getFullYear();

      let className = "flex items-center justify-center w-8 h-8 mx-auto rounded-full ";

      if (selected) {
        className += "text-white font-medium";
      } else if (isDisabled) {
        className += "text-gray-400";
      } else {
        className += "hover:bg-[#0a00b3] hover:text-white text-gray-800";
      }

      if (isToday(day)) {
        className += " font-bold";
      }

      days.push(
        <div key={day} className="p-2 text-center">
          <button
            onClick={() => {
              if (!isDisabled) {
                setDate(new Date(year, month, day));
                setSelectedTimeSlot("");
              }
            }}
            disabled={isDisabled}
            className={className}
            style={selected ? { backgroundColor: '#080093' } : {}}
          >
            {day}
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-200">
            <ChevronLeft size={24} />
          </button>
          <div className="text-lg font-medium">
            {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
          </div>
          <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-200">
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekdayHeaders}
          {days}
        </div>
      </div>
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const isDateBlocked = () => {
    return (
      date.getTime() <= todayDate.getTime() ||
      date.getDay() === 0 ||
      date.getDay() === 6
    );
  };

  const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET) - New York" },
    { value: "America/Chicago", label: "Central Time (CT) - Chicago" },
    { value: "America/Denver", label: "Mountain Time (MT) - Denver" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT) - Los Angeles" },
    { value: "America/Anchorage", label: "Alaska Time - Anchorage" },
    { value: "Pacific/Honolulu", label: "Hawaii Time - Honolulu" },
    { value: "America/Toronto", label: "Eastern Time - Toronto" },
    { value: "America/Vancouver", label: "Pacific Time - Vancouver" },
    { value: "America/Mexico_City", label: "Central Time - Mexico City" },
    { value: "America/Sao_Paulo", label: "Brasilia Time - São Paulo" },
    { value: "America/Buenos_Aires", label: "Argentina Time - Buenos Aires" },
    { value: "America/Santiago", label: "Chile Time - Santiago" },
    { value: "America/Bogota", label: "Colombia Time - Bogotá" },
    { value: "America/Lima", label: "Peru Time - Lima" },
    { value: "Europe/London", label: "GMT/BST - London" },
    { value: "Europe/Paris", label: "Central European Time - Paris" },
    { value: "Europe/Berlin", label: "Central European Time - Berlin" },
    { value: "Europe/Madrid", label: "Central European Time - Madrid" },
    { value: "Europe/Rome", label: "Central European Time - Rome" },
    { value: "Europe/Amsterdam", label: "Central European Time - Amsterdam" },
    { value: "Europe/Athens", label: "Eastern European Time - Athens" },
    { value: "Europe/Moscow", label: "Moscow Time - Moscow" },
    { value: "Asia/Dubai", label: "Gulf Standard Time - Dubai" },
    { value: "Asia/Kolkata", label: "India Standard Time - New Delhi" },
    { value: "Asia/Singapore", label: "Singapore Time" },
    { value: "Asia/Tokyo", label: "Japan Standard Time - Tokyo" },
    { value: "Asia/Hong_Kong", label: "Hong Kong Time" },
    { value: "Asia/Seoul", label: "Korea Standard Time - Seoul" },
    { value: "Asia/Shanghai", label: "China Standard Time - Beijing" },
    { value: "Asia/Bangkok", label: "Indochina Time - Bangkok" },
    { value: "Asia/Manila", label: "Philippines Time - Manila" },
    { value: "Australia/Sydney", label: "Australian Eastern Time - Sydney" },
    { value: "Australia/Melbourne", label: "Australian Eastern Time - Melbourne" },
    { value: "Australia/Perth", label: "Australian Western Time - Perth" },
    { value: "Australia/Brisbane", label: "Australian Eastern Time - Brisbane" },
    { value: "Australia/Adelaide", label: "Australian Central Time - Adelaide" },
    { value: "Pacific/Auckland", label: "New Zealand Time - Auckland" },
  ];

  const renderTimeSlots = () => {
    if (isDateBlocked()) {
      return (
        <div className="text-red-600 mt-2 mb-4">
          No times available for {date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          <br />Please select another date
        </div>
      );
    }

    return (
      <div className="mt-4 mb-6">
        <h4 className="text-lg font-medium mb-2">Available Time Slots</h4>
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              className={`py-2 px-4 border rounded-md ${
                selectedTimeSlot === slot.id
                  ? "text-white border-[#0a00b3]"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-[#0a00b3] hover:text-white"
              }`}
              onClick={() => setSelectedTimeSlot(slot.id)}
              style={selectedTimeSlot === slot.id ? { backgroundColor: '#080093' } : {}}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans">
      <div style={{ backgroundColor: '#080093' }} className="text-white p-6 flex items-center">
        <h1 className="text-3xl font-bold">Book a 1-on-1 demo</h1>
        <span className="ml-4 text-xl">➔</span>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8">
        <div style={{ backgroundColor: '#080093' }} className="text-white rounded-lg p-6 flex-1">
     <div className="flex -space-x-2 mb-6">
    <div className="w-12 h-12 rounded-full bg-white border-2 border-[#0a00b3] flex items-center justify-center overflow-hidden">
      <img src="../assets/img1.png" alt="Sreevats Mishra" />
    </div>
    <div className="w-12 h-12 rounded-full bg-white border-2 border-[#0a00b3] flex items-center justify-center overflow-hidden">
      <img src="../assets/img2.png" alt="Amit Patel" />
    </div>
    <div className="w-12 h-12 rounded-full bg-white border-2 border-[#0a00b3] flex items-center justify-center overflow-hidden">
      <img src="../assets/img3.png" alt="Rahul Mehta " />
    </div>
    <div className="w-12 h-12 rounded-full bg-white border-2 border-[#0a00b3] flex items-center justify-center overflow-hidden">
      <img src="../assets/img4.png" alt="Sneha Gupta" />
    </div>
  </div>

  <div className="space-y-4 mb-8">
    <div className="flex items-center gap-3">
      <Clock className="text-white" size={20} />
      <span className="text-lg">30 min</span>
    </div>
    <div className="flex items-center gap-3">
      <Globe className="text-white" size={20} />
      <span className="text-lg">English / Hindi</span>
    </div>
    <div className="flex items-center gap-3">
      <Video className="text-white" size={20} />
      <span className="text-lg">Zoom / Google Meet</span>
    </div>
  </div>

  <div className="mt-8">
    <p className="text-lg mb-4">
      Choose the day and time for your demo with our representative, where you'll:
    </p>
    <ul className="list-disc pl-6 space-y-2">
      <li>See how the system fits your business</li>
      <li>Select the right filters and addons for your needs</li>
      <li>Get all your questions answered</li>
    </ul>
  </div>
</div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
            {!userInfo ? (
              <div className="text-center py-8">
                <h3 className="text-xl font-bold mb-4">Please Log In to Book a Demo</h3>
                <p className="text-gray-600 mb-6">You need to be logged in to schedule a demo call.</p>
                <a
                  href="/login"
                  className="inline-block py-3 px-6 text-white font-medium rounded-md hover:bg-[#0a00b3]"
                  style={{ backgroundColor: '#080093' }}
                >
                  Log In / Sign Up
                </a>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Select a Date & Time</h3>
                  <button
                    onClick={handleLogout}
                    className="py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
                  >
                    Log Out
                  </button>
                </div>

                {renderCalendar()}

                <div className="mt-4">
                  <p className="text-lg font-medium">{formatDate(date)}</p>
                </div>

                {renderTimeSlots()}

                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium">Time zone</label>
                  <div className="relative">
                    <select
                      className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-700"
                      value={selectedTimezone}
                      onChange={(e) => setSelectedTimezone(e.target.value)}
                    >
                      <optgroup label="North America">
                        {timezones
                          .filter(
                            (tz) =>
                              tz.value.startsWith("America/") &&
                              ![
                                "America/Sao_Paulo",
                                "America/Buenos_Aires",
                                "America/Santiago",
                                "America/Bogota",
                                "America/Lima",
                              ].includes(tz.value)
                          )
                          .concat(timezones.filter((tz) => tz.value.startsWith("Pacific/H")))
                          .map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="South America">
                        {timezones
                          .filter((tz) =>
                            [
                              "America/Sao_Paulo",
                              "America/Buenos_Aires",
                              "America/Santiago",
                              "America/Bogota",
                              "America/Lima",
                            ].includes(tz.value)
                          )
                          .map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Europe">
                        {timezones
                          .filter((tz) => tz.value.startsWith("Europe/"))
                          .map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Asia">
                        {timezones
                          .filter((tz) => tz.value.startsWith("Asia/"))
                          .map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Australia & Oceania">
                        {timezones
                          .filter((tz) => tz.value.startsWith("Australia/") || tz.value.startsWith("Pacific/A"))
                          .map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="user-info mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h4 className="font-medium mb-2">Your Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p>{userInfo?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{userInfo?.email}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBookDemo}
                  disabled={isLoading || !selectedTimeSlot || isDateBlocked()}
                  className={`w-full py-3 font-medium rounded-md text-white ${
                    isLoading || !selectedTimeSlot || isDateBlocked()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "hover:bg-[#0a00b3]"
                  }`}
                  style={{ backgroundColor: isLoading || !selectedTimeSlot || isDateBlocked() ? undefined : '#080093' }}
                >
                  {isLoading ? "Booking..." : "Book Demo"}
                </button>
                {bookingStatus.message && (
                  <p
                    className={`text-center mt-4 ${
                      bookingStatus.type === "success" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {bookingStatus.message}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;