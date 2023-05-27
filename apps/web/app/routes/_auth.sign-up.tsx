import { json, redirect } from '@remix-run/node'
import type { ActionFunction } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'

import styled from 'styled-components'
import { FillButton, Icon, Input } from '@bash/design-system'

import { createServerClient } from '~/services/db.server'
import { ROUTES } from './types'
import { ErrorMessages, Validations, validateField } from '~/utils'

const StyledButton = styled(FillButton)`
  padding: 0.5rem 1rem;
  margin: auto;
`

const ErrorMessage = styled.span`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.color.red};
  margin-top: 0.5em;
  margin-left: 0.5em;
  margin-bottom: 1em;

  span {
    display: none;

    &:has(> :not(:focus):not(:placeholder-shown):invalid) {
      display: flex;
    }
  }
`

const ErrorIcon = styled(Icon)`
  font-size: inherit;
  margin-right: 0.5em;
  height: 1.25em;
`

export const action: ActionFunction = async ({ request }) => {
  const response = new Response()
  const db = createServerClient({ request, response })

  const form = Object.fromEntries(await request.formData())

  const formErrors = {
    email: validateField('email', form.email as string),
    password: validateField('password', form.password as string),
  }

  if (formErrors.email || formErrors.password) {
    return json({ errors: formErrors, values: { ...form } })
  }

  const {
    data: { user },
    error,
  } = await db.auth.admin.createUser({
    email: form.email as string,
    password: form.password as string,
    email_confirm: true,
  })

  if (error) {
    return json({
      errors: { ...formErrors, global: error.message },
      values: { ...form },
    })
  }

  if (user) {
    return redirect(ROUTES.CALENDAR, { headers: response.headers })
  }

  return json({
    headers: response.headers,
  })
}

export default function SignIn() {
  const formData = useActionData<typeof action>()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  return (
    <Form method='post' noValidate>
      <Input
        label='email address'
        name='email'
        type='email'
        placeholder='hello@bashapp.co'
        defaultValue={formData?.values?.email}
        serverError={formData?.errors.email}
        errorMessages={ErrorMessages.email}
        pattern={Validations.email.pattern.value.source}
        required={Validations.password.required.value}
        disabled={isSubmitting}
      />

      <Input
        label='password'
        name='password'
        type='password'
        placeholder='••••••••••••'
        defaultValue={formData?.values?.password}
        serverError={formData?.errors.password}
        errorMessages={ErrorMessages.password}
        pattern={Validations.password.pattern.value.source}
        required={Validations.password.required.value}
        minLength={Validations.password.minLength.value}
        maxLength={Validations.password.maxLength.value}
        disabled={isSubmitting}
      />

      <ErrorMessage aria-live='polite'>
        <span>
          <ErrorIcon name='error' /> {formData?.errors?.global}
        </span>
      </ErrorMessage>

      <StyledButton disabled={isSubmitting} type='submit'>
        create account
      </StyledButton>
    </Form>
  )
}
