import React from 'react';
import { User } from '../types';

interface ProfileTitleProps {
  user: User;
  nameClassName?: string;
  ageClassName?: string;
  separatorClassName?: string;
}

export const ProfileTitle: React.FC<ProfileTitleProps> = ({ 
  user, 
  nameClassName = "", 
  ageClassName = "",
  separatorClassName = ""
}) => {
  const members = user.members && user.members.length > 0 
    ? user.members 
    : [{ name: user.name, age: user.age }];

  const displayMembers = members.slice(0, 2);
  const othersCount = members.length - 2;

  return (
    <>
      {displayMembers.map((member, index) => (
        <React.Fragment key={index}>
          <span className={nameClassName}>{member.name}</span>
          <span className={ageClassName}>({member.age})</span>
          {index < displayMembers.length - 1 && (
            <span className={separatorClassName || nameClassName}>&amp;</span>
          )}
        </React.Fragment>
      ))}
      {othersCount > 0 && (
        <>
          <span className={separatorClassName || nameClassName}>+</span>
          <span className={nameClassName}>{othersCount} other{othersCount > 1 ? 's' : ''}</span>
        </>
      )}
    </>
  );
};
