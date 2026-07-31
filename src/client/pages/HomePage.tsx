import logo from '@/client/assets/modelence.svg';
import Page from '@/client/components/Page';

export default function HomePage() {
  return (
    <Page className="bg-gray-100">
      <div className="max-w-6xl mx-auto flex-1 flex items-center justify-center">
        <PlaceholderView />
      </div>
    </Page>
  );
}

// TODO: Replace with actual content
function PlaceholderView() {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-8">
        <img src={logo} alt="Modelence Logo" className="w-32 h-32" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900">Your app starts here</h1>
      <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
        Tell your agent what you want to build, and this page will come to life.
      </p>
    </div>
  );
}
