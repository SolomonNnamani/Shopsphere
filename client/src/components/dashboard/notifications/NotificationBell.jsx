import React, { useState, useEffect,useRef } from "react";
import { GoBell } from "react-icons/go";
import { toast } from "react-toastify";
import {fetchWithAuth} from '../utils/fetchWithAuth.js';

const NotificationBell = ({loading,setLoading}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropDownRef = useRef()

    const fetchNotifications = async() =>{
    try{
      const res = await fetchWithAuth("/api/dashboard/notifications");
      const data = await res.json();
      setNotifications(data)
    } catch(err){
      console.log("Notification fetch error:", err.message);
    }finally{
      setLoading(false)
    }
  }

  //mark as read.
  const markAsRead = async (id) => {
    const role = localStorage.getItem("role");

    if(role !== "admin"){
      toast.error("You must be an admin to perform this action!")
      return
    }else{
      await fetchWithAuth(`/api/dashboard/notifications/${id}/mark-read`, {
        method: "PUT"
      })
      fetchNotifications(); //refresh list
    }
  }


    //deleteNotification
  const deleteNotification = async (id) => {
    const role = localStorage.getItem("role");

    if(role !== "admin"){
      toast.error("You must be an admin to perform this action!")
      return
    }else{
      await fetchWithAuth(`/api/dashboard/notifications/${id}`, {
        method: "DELETE"
      })
      fetchNotifications(); //refresh list
    }

  }

  //clear All notification.
  const clearAllNotifications = async (id) => {
    const role = localStorage.getItem("role");

    if(role !== "admin"){
      toast.error("You must be an admin to perform this action!")
      return
    }else{
      await fetchWithAuth(`/api/dashboard/notifications`, {
        method: "DELETE"
      })
      fetchNotifications(); //refresh list
    }

  }

 useEffect(()=> {
fetchNotifications()
  },[])

 const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(()=> {
    const handleClickOutside = (e) => {
      const clickedToggle = e.target.closest('[data-note-toggle]')
      if(dropDownRef.current && !dropDownRef.current.contains(e.target) && !clickedToggle){
        setIsOpen(false)
      }
    };

    if(isOpen){
      document.addEventListener('mousedown', handleClickOutside);
    }

    return ()=> {
      document.removeEventListener('mousedown', handleClickOutside)
    }

  },[isOpen,setIsOpen])

  return (
    <div className="relative"
      
    >
      <button
        data-note-toggle
       onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full "
      >
        <GoBell className="md:size-5" />
        {
          unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
            )
        }
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg p-4 z-50"
          ref={dropDownRef}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-black">Notifications</h4>
            {/*clear all btn */}
            <button 
              onClick={clearAllNotifications}
              className="text-sm text-red-500 hover:underline"
            > 
              Clear All
            </button>
          </div>

          {loading ? (
            <p className="text-sm"> Loading...</p>
            ) : notifications?.length === 0 ? (
            <p className="text-sm text-gray-500"> No notifications </p>
            ) : (
            <ul className="space-y-3 max-h-[300px] overflow-y-auto"> 
              {notifications.slice(0,10).map((note)=> (
                <li key={note._id}
                  className={`p-3 rounded-md border ${!note.isRead ?  "bg-gray-100" : "bg-white"  }`}    
                >
                  <div className={`text-sm text-black font-medium ${note.isRead ? "line-through text-gray-300" : "" }`}> {note.message || "No new message"} </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                    <div className="space-x-2">
                      {!note.isRead && (
                        <button
                          onClick={()=> markAsRead(note._id)}
                          className="text-blue-500 hover:underline"
                        >
                          Mark as read
                        </button>
                        )}

                      {/*delete notification*/}
                      <button
                        onClick={() => deleteNotification(note._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>


                    </div>



                  </div>
                  

                </li>
                ))}


            </ul>
            )


        }


        </div>
        )}
     
    </div>
  );
};

export default NotificationBell;
