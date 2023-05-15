import { NavLink, Outlet, useLocation } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { getAuth } from '@clerk/remix/ssr.server'

import styled from 'styled-components'
import { Icon } from '@bash/design-system'

const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  min-height: 100%;
  width: 100%;
`

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 auto;
  width: 100%;
  padding: ${({theme}) => theme.space.sm};
  max-width: ${({theme}) => theme.size.md};
`

const StyledNavLink = styled(NavLink)`
  margin-left: ${({ theme }) => theme.space.xxs};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.color.grey};
  border-radius: ${({theme}) => theme.space.xxs};
  border: solid 0.0125rem currentColor;
  margin-top: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.xs};
  width: 100%;
`

const StyledLogo = styled(Icon)`
  display: block;
  background-color: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.black};
  font-size: ${({ theme }) => theme.fontSize['3']};
  height: 2em;
  width: 2em;
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  overflow: visible;
`

const StyledH1 = styled.h1`
  font-size: ${({theme}) => theme.fontSize['2']};
`

enum Route {
  SIGN_UP = '/sign-up',
  SIGN_IN = '/sign-in'
}

const LINK_COPY = {
  [Route.SIGN_UP]: {
    cta: 'sign in',
    message: 'already have an account?',
    route: '/sign-in',
  },
  [Route.SIGN_IN]: {
    cta: 'create an account',
    message: 'new to bash?',
    route: '/sign-up',
  }
} as const

const HEADER_COPY = {
  [Route.SIGN_IN]: 'sign in to',
  [Route.SIGN_UP]: 'sign up for',
}

interface RedirectLinkProps {
  pathname: Route
}

const RedirectLink: React.FC<RedirectLinkProps> = ({ pathname }) => {
  const { cta, message, route } = LINK_COPY[pathname]

  return (
    <StyledContainer>
      {message}
      <StyledNavLink to={route}>{cta}.</StyledNavLink>
    </StyledContainer>
  )
}

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args)

  if (userId) {
    return redirect('/dashboard', 302)
  }

  return null
}

export default function Auth() {
  const { pathname } = useLocation()
  const title = HEADER_COPY[pathname as Route]

  return (
    <StyledLayout>
      <StyledMain>
        <NavLink title="bash." to="/" end>
          <StyledLogo name="logo-mobile" />
        </NavLink>
        <StyledH1>{title} bash.</StyledH1>
        <Outlet />
        <RedirectLink pathname={pathname as Route} />
      </StyledMain>
    </StyledLayout>
  )
}