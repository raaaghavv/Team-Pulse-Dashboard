import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, switchRole } from '../redux/slices/roleSlice';

const MemberSelectionModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.members.list);
  const teamMembers = members.filter((member) => member.role === 'TeamMember');

  const handleSelectMember = (member) => {
    dispatch(setUser(member));
    dispatch(switchRole('TeamMember'));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Select a Team Member
        </h3>
        <ul className="space-y-2">
          {teamMembers.map((member) => (
            <li key={member.id}>
              <button
                onClick={() => handleSelectMember(member)}
                className="w-full text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {member.name}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MemberSelectionModal;