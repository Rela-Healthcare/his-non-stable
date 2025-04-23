import {FieldValues, useForm, UseFormProps} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const useYupForm = <T extends FieldValues>(
  schema: yup.ObjectSchema<any>,
  options?: UseFormProps<T>
) =>
  useForm<T>({
    ...options,
    resolver: yupResolver(schema),
  });
