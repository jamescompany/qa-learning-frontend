export const profile = {
  title: '프로필 정보',
  editProfile: '프로필 편집',
  saveChanges: '변경사항 저장',
  cancel: '취소',
  success: '성공',
  error: '오류',
  profileUpdatedSuccess: '프로필이 성공적으로 업데이트되었습니다',
  profileUpdateError: '프로필 업데이트 중 오류가 발생했습니다',
  noProfileInfo: '프로필 정보가 없습니다',
  
  fields: {
    name: '이름',
    email: '이메일',
    bio: '자기소개',
    location: '위치',
    website: '웹사이트',
  },
  
  placeholders: {
    name: '이름을 입력하세요',
    email: '이메일을 입력하세요',
    bio: '자신에 대해 소개해주세요',
    location: '위치를 입력하세요',
    website: 'https://example.com',
  },
  
  activityStats: '활동 통계',
  stats: {
    posts: '게시물',
    todosCompleted: '완료된 할 일',
    daysActive: '활동 일수',
  },
  
  security: {
    title: '보안',
    changePassword: '비밀번호 변경',
    currentPassword: '현재 비밀번호',
    newPassword: '새 비밀번호',
    confirmPassword: '새 비밀번호 확인',
    updatePassword: '비밀번호 업데이트',
    passwordHint: '최소 8자, 대문자, 소문자, 숫자 포함',
    passwordChanged: '비밀번호가 성공적으로 변경되었습니다',
    passwordChangeError: '비밀번호 변경 중 오류가 발생했습니다',
    currentPasswordIncorrect: '현재 비밀번호가 올바르지 않습니다',
    
    placeholders: {
      currentPassword: '현재 비밀번호를 입력하세요',
      newPassword: '새 비밀번호를 입력하세요',
      confirmPassword: '새 비밀번호를 다시 입력하세요',
    },
    
    errors: {
      currentPasswordRequired: '현재 비밀번호는 필수입니다',
      newPasswordRequired: '새 비밀번호는 필수입니다',
      confirmPasswordRequired: '비밀번호 확인은 필수입니다',
      passwordMinLength: '비밀번호는 최소 8자 이상이어야 합니다',
      passwordRequirements: '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다',
      passwordMustBeDifferent: '새 비밀번호는 현재 비밀번호와 달라야 합니다',
      passwordsDoNotMatch: '비밀번호가 일치하지 않습니다',
    },
    
    securityTips: {
      title: '보안 팁:',
      tip1: '강력한 비밀번호를 사용하세요',
      tip2: '정기적으로 비밀번호를 변경하세요',
      tip3: '다른 사이트와 동일한 비밀번호를 사용하지 마세요',
      tip4: '비밀번호를 다른 사람과 공유하지 마세요',
    },
  },
};