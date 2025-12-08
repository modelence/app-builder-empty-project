import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { modelenceQuery, createQueryKey } from '@modelence/react-query';

type ExampleItem = {
  title: string;
  createdAt: Date;
};

export default function ExamplePage() {
  const { itemId } = useParams<{ itemId: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    ...modelenceQuery<ExampleItem>('example.getItem', { itemId }),
    enabled: !!itemId,
  });

  const invalidateItem = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: createQueryKey('example.getItem', { itemId }) });
  }, [queryClient, itemId]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {error && <div>Error: {(error as Error).message}</div>}
      {data && (
        <>
          <h1>{data.title}</h1>
          <p>Created: {new Date(data.createdAt).toLocaleString()}</p>
        </>
      )}
      <button onClick={invalidateItem}>Invalidate Item</button>
    </div>
  );
}
