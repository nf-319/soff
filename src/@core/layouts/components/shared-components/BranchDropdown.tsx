'use client'

import { useRouter } from 'next/router'
import Icon from 'src/components/icon'
import OptionsMenu from 'src/components/option-menu'
import { Typography } from '@mui/material'
import api from 'src/@core/utils/api'
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import useResponsive from 'src/@core/hooks/useResponsive'

const BranchDropdown = () => {
  const { user, initAuth } = useContext(AuthContext)
  const router = useRouter()
  const { isMobile } = useResponsive()
  const activeBranch = user?.branches?.find((el: any) => Number(el.id) === Number(user.active_branch))
  const branchName = activeBranch?.name || ''
  const shortName = branchName.length > 6 ? branchName.slice(0, 6) + '...' : branchName

  const handleLangItemClick = async (id: number) => {
    try {
      if (user?.active_branch !== id) {
        await api.post('auth/branch-update/', { branch: id })
        initAuth()

        const currentPath = window.location.pathname

        if (currentPath.includes('/groups')) {
          void router.replace('/groups')
        } else if (currentPath.includes('/students')) {
          void router.replace('/students')
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  return user && user?.branches ? (
    <OptionsMenu
      iconButtonProps={{ sx: { borderRadius: '5px' } }}
      icon={
        !isMobile ? (
          <Typography>
            {user?.branches.find((el: any) => Number(el.id) === Number(user.active_branch))?.name}{' '}
            <Icon icon='ep:arrow-down-bold' fontSize={12} />
          </Typography>
        ) : (
          <Typography>
            {user?.branches.find((el: any) => Number(el.id) === Number(user.active_branch))?.name.length > 6
              ? user?.branches.find((el: any) => Number(el.id) === Number(user.active_branch))?.name.slice(0, 6) + '...'
              : user?.branches.find((el: any) => Number(el.id) === Number(user.active_branch))?.name}{' '}
            <Icon icon='ep:arrow-down-bold' fontSize={12} />
          </Typography>
        )
      }
      options={user?.branches
        .filter((item: any) => item.exists === true)
        .map((el: any) => ({
          text: el.name,
          menuItemProps: {
            sx: { py: 2 },
            selected: Number(el.id) === Number(user.active_branch),
            onClick: () => {
              void handleLangItemClick(el.id)
            }
          }
        }))}
    />
  ) : null
}

export default BranchDropdown
