import { Alert, Button, Stack } from '@mui/material'
import { useWatch } from 'react-hook-form-mui'

export type SubmitFormProps = {
  names: string[]
}

export default function SubmitForm({ names }: SubmitFormProps) {
  const watchedNames = useWatch({
    name: names
  })
  return (
    <>
      <Stack spacing={3}>
        <Button
          type="submit"
          color="primary"
          variant="text"
          disabled={watchedNames.some(x => !x)}
          sx={{ width: 'fit-content' }}
        >
          Submit
        </Button>
        <Alert variant={'outlined'} severity={'info'}>
          You have to fill out the required fields before the Button activates.
        </Alert>
      </Stack>
    </>
  )
}
