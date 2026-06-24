import React from 'react';
import { BASE_URL } from '../data/layoutData';

interface BirthdayModalProps {
  birthdayEmployees: any[];
  isMyBirthday: boolean;
  currentEmployee: any;
  user: any;
  onClose: () => void;
  onSendWish: (emp: any) => void;
}

const BirthdayModal: React.FC<BirthdayModalProps> = ({
  birthdayEmployees,
  isMyBirthday,
  currentEmployee,
  user,
  onClose,
  onSendWish,
}) => {
  if (isMyBirthday) {
    return (
      <div className="fixed top-5 right-5 z-[9999] w-[380px]">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-[700px] max-w-full">
          <div className="relative bg-gradient-to-r from-sky-100 via-blue-50 to-sky-100 min-h-[500px] overflow-hidden">
            <div className="absolute top-6 left-8 text-4xl">🎈</div>
            <div className="absolute top-10 right-12 text-5xl">🎉</div>
            <div className="absolute bottom-10 left-10 text-5xl">🎊</div>
            <div className="absolute bottom-16 right-16 text-4xl">🎁</div>
            <div className="absolute top-24 right-32 text-3xl">⭐</div>
            <div className="absolute bottom-32 left-32 text-3xl">✨</div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-100 z-20"
            >✕</button>

            <div className="relative z-10 flex flex-col items-center justify-center px-8 py-12 text-center">
              <img
                src={`${BASE_URL}/employees/image/${currentEmployee?.id}`}
                alt="Birthday"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                onError={(e) => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
              />
              <h3 className="mt-8 text-4xl font-light text-blue-900">Happy</h3>
              <h1 className="text-7xl font-extrabold text-blue-800 tracking-wide">Birthday</h1>
              <p className="mt-6 text-2xl font-semibold text-gray-800">{user?.full_name}</p>
              <p className="mt-4 text-lg text-gray-700">You Are The Most Amazing</p>
              <p className="mt-3 text-sm text-gray-600 max-w-lg leading-6">
                We hope you always stay happy and all your dreams come true. Wishing you success, prosperity, good health and happiness throughout the year.
              </p>
              <div className="mt-8 bg-white shadow-lg rounded-full px-8 py-3 border">
                🎂 Have A Wonderful Birthday 🎂
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-5 right-5 z-[9999] w-[380px]">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 px-5 py-4 flex justify-between items-center">
          <h2 className="text-white font-semibold text-base">🎉 Today's Birthdays</h2>
          <button onClick={onClose} className="text-white text-xl leading-none hover:opacity-80 transition-opacity">✕</button>
        </div>

        <div className="max-h-[350px] overflow-y-auto p-4 space-y-3">
          {birthdayEmployees.map((emp: any) => (
            <div key={emp.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
              <img
                src={`${BASE_URL}/employees/image/${emp.id}`}
                alt={emp.first_name}
                className="w-14 h-14 rounded-full object-cover border border-gray-300 shadow-sm"
                onError={(e) => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{emp.first_name} {emp.last_name}</h3>
                <p className="text-xs text-gray-500 truncate">{emp.designation}</p>
                <p className="text-xs text-gray-700 font-medium mt-0.5">🎂 Birthday Today</p>
              </div>
              <button
                onClick={() => onSendWish(emp)}
                className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
              >
                Wishes
              </button>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-gray-500 py-3 border-t border-gray-200 bg-gray-50">
          — S4 Carlisle Publishing Services
        </div>
      </div>
    </div>
  );
};

export default BirthdayModal;