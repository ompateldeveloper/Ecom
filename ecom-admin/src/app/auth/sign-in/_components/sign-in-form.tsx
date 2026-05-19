'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { signIn } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
    });

    const mutation = useMutation({
        mutationFn: async (values: SignInValues) => {
            const { error } = await signIn.email({
                email: values.email,
                password: values.password,
            });
            if (error) throw new Error(error.message || 'Failed to sign in');
        },
        onSuccess: () => {
            router.push('/');
        },
    });

    return (
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4 w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    {...register('password')}
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {mutation.isError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                    {mutation.error.message}
                </div>
            )}

            <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
            >
                {mutation.isPending ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
    );
}
