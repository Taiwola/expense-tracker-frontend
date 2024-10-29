import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {useMutation} from "react-query";
import { createCategoryRoute } from '@/api/category/route';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from './ui/toast';

// Validation schema for creating a category
const createCategorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
});

type Props = {
    onClose: () => void
}

export type TCategorySchema = z.infer<typeof createCategorySchema>;

export const CategoryPopover = ({onClose}: Props) => {
    const {toast} = useToast();
   
    const { register, handleSubmit, formState: { errors } } = useForm<TCategorySchema>({
        resolver: zodResolver(createCategorySchema),
    });

    const mutation = useMutation(createCategoryRoute, {
        onSuccess: () => {
            toast({
              variant: "default",
              title: "Success",
              description: "Category was created successfully",
              className: "border text-black font-medium dark:bg-black dark:text-white",
            });
            setTimeout(() => {
              window.location.reload();
          }, 1000);
          },
          onError: (error: Error) => {
            toast({
              variant: "default",
              title: "Error",
              description: error.message,
              className: "bg-red-400 text-white font-medium",
              action: (
                <ToastAction altText="Try again" className="hover:bg-red-400">
                  Try again
                </ToastAction>
              ),
            });
        }
    });
    
    const onSubmit = async (data: TCategorySchema) => {
        try {
            mutation.mutate(data);
            onClose(); 
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    return (
      <>
         <h3 className="text-lg font-semibold mb-2">Create Category</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                        id="name"
                        type="text"
                        {...register('name')}
                        className="border-gray-300 rounded-md p-2 w-full"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div>
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input
                        id="description"
                        type="text"
                        {...register('description')}
                        className="border-gray-300 rounded-md p-2 w-full"
                    />
                </div>

                <div className="flex justify-end">

                    <Button type="submit" className="bg-[#010D3E] text-white rounded-md p-2">
                        Create Category
                    </Button>
                </div>
            </form>
      </>
    );
};
