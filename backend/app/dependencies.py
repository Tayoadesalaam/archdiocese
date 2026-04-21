from fastapi import Depends, HTTPException, status
from app import models
from app.auth import get_current_active_user

def require_role(*allowed_roles):
    def role_checker(current_user: models.User = Depends(get_current_active_user)):
        if current_user.role.value not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this resource"
            )
        return current_user
    return role_checker

def require_archbishop():
    return require_role("ARCHBISHOP")

def require_archbishop_or_chancellor():
    return require_role("ARCHBISHOP", "CHANCELLOR")

def require_priest():
    return require_role("ARCHBISHOP", "CHANCELLOR", "PRIEST")

def require_parish_access(parish_id: int, current_user: models.User = Depends(get_current_active_user)):
    """Check if user has access to a specific parish"""
    if current_user.role.value in ["ARCHBISHOP", "CHANCELLOR"]:
        return True
    if current_user.role.value == "PRIEST" and current_user.parish_id == parish_id:
        return True
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You don't have access to this parish"
    )