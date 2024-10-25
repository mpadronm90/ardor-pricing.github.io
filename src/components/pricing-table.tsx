import { useState } from 'react'
import { Check } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'For individuals and small teams getting started',
    features: [
      'AI Cerebrum Architect: 10 fast messages per hour, infinite slow messages',
      'Custom Code',
      'Deployment on Ardor Cloud',
    ],
    baseAllocation: {
      vCPU: 1,
      RAM: 2,
      vRAM: 8,
      storage: 10
    },
  },
  {
    name: 'Core',
    price: { monthly: 40, yearly: 32 },
    description: 'For growing teams and businesses',
    features: [
      'AI Cerebrum Architect: 50 fast messages per hour, infinite slow messages',
      'Local AI models',
      'AI Debugger',
      'Role-based access control',
      'Reserved deployments: Starting at $100 per month',
    ],
    baseAllocation: {
      vCPU: 4,
      RAM: 16,
      vRAM: 16,
      storage: 50
    },
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale applications and organizations',
    features: [
      'Deployment to AWS, Google Cloud, or Azure',
      '1-to-1 meeting with our experts',
      'Support for personal configuration',
      'Prioritizing your feedback',
    ],
    baseAllocation: {
      vCPU: 16,
      RAM: 64,
      vRAM: 32,
      storage: 200
    },
  },
]

const resourcePrices = {
  vCPU: 0.000011244,
  RAM: 0.000001235,
  vRAM: 0.00076,
  storage: 0.15 / (30 * 24 * 60 * 60) // Convert monthly price to per-second
}

// Define a type for the plan
type Plan = {
  name: string;
  price: string | { monthly?: number; yearly?: number };
  description: string;
  features: string[];
  baseAllocation: {
    vCPU: number;
    RAM: number;
    vRAM: number;
    storage: number;
  };
};

export function PricingTableComponent() {
  const [isYearly, setIsYearly] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    useCase: '',
    plan: '',
  })
  const [showThankYou, setShowThankYou] = useState(false)

  const calculateMonthlyPrice = (price: string | { monthly?: number; yearly?: number }) => {
    if (price === 'Free' || price === 'Custom') return price;
    if (typeof price === 'object') {
      return isYearly ? price.yearly : price.monthly;
    }
    return 0; // or handle the case where price is a string
  }
  const handlePlanSelection = (plan: Plan | null) => {
    if (plan) {
      setSelectedPlan(plan);
      setShowForm(true);
      setFormData(prev => ({ ...prev, plan: plan.name }));
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      const response = await fetch('https://hook.us1.make.com/h8k8m4bhl0o2w79jwv8z826ghniejxyf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      if (formData.plan === 'Enterprise') {
        window.open('https://calendly.com/michel-ardor/30min', '_blank')
      }

      setShowForm(false)
      setShowThankYou(true)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-4">Pricing Plans</h2>
      <p className="text-center text-lg font-semibold mb-8">
        Limited Offer! 🎉 Get 30% off Core and Enterprise plans—only 20 spots left! The Starter Plan is free forever for early users.
      </p>
      
      {!showForm && !showThankYou && (
        <>
          <div className="flex justify-center items-center mb-8">
            <span className={`mr-3 text-sm font-medium ${!isYearly ? 'text-[#F57738]' : ''}`}>Monthly</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="bg-gray-200 data-[state=checked]:bg-[#F57738] relative inline-flex items-center h-6 rounded-full w-11"
            >
              <span
                className={`transform transition ease-in-out duration-200 ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 bg-white rounded-full shadow`}
              />
            </Switch>
            <span className={`ml-3 text-sm font-medium ${isYearly ? 'text-[#F57738]' : ''}`}>Yearly (Save 20%)</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, index) => (
              <Card key={plan.name} className={`flex flex-col ${index === 1 ? 'border-[#F57738] shadow-lg' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-4xl font-bold mb-4">
                    {plan.price === 'Custom' ? (
                      'Custom'
                    ) : (
                      <>
                        {plan.price === 'Free' ? 'Free' : `$${calculateMonthlyPrice(plan.price)}`}
                        <span className="text-sm font-normal">/month</span>
                      </>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {index > 0 && (
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium">All features from {plans[index - 1].name}</span>
                      </li>
                    )}
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex-col items-stretch">
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Included Hardware:</h4>
                    <ul className="text-sm">
                      <li>{plan.baseAllocation.vCPU} vCPU</li>
                      <li>{plan.baseAllocation.RAM} GB RAM</li>
                      <li>{plan.baseAllocation.vRAM} GB vRAM</li>
                      <li>{plan.baseAllocation.storage} GB Storage</li>
                    </ul>
                  </div>
                  <Button className="w-full bg-[#F57738] hover:bg-[#CA4EE5]" onClick={() => handlePlanSelection(plan)}>
                    {plan.name === 'Enterprise' ? 'Request a Demo' : 'Get Started'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-100 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-black">Pay-as-you-go Rates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="font-semibold text-black">vCPU</p>
                <p className="text-black">${resourcePrices.vCPU.toFixed(7)}/vCPU-second</p>
              </div>
              <div>
                <p className="font-semibold text-black">RAM</p>
                <p className="text-black">${resourcePrices.RAM.toFixed(9)}/GB-second</p>
              </div>
              <div>
                <p className="font-semibold text-black">vRAM</p>
                <p className="text-black">${resourcePrices.vRAM.toFixed(5)}/GB-second</p>
              </div>
              <div>
                <p className="font-semibold text-black">Storage</p>
                <p className="text-black">$0.15/GB-month</p>
              </div>
            </div>
          </div>
        </>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <Label htmlFor="plan">Selected Plan</Label>
            <Select name="plan" value={formData.plan} onValueChange={(value) => setFormData(prev => ({ ...prev, plan: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.name} value={plan.name}>{plan.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="company">Company</Label>
            <Input type="text" name="company" value={formData.company} onChange={handleInputChange} />
          </div>
          <div className="mb-4">
            <Label htmlFor="useCase">What do you want to use Ardor for?</Label>
            <Textarea name="useCase" value={formData.useCase} onChange={handleInputChange} />
          </div>
          <Button type="submit" className="w-full bg-[#F57738] hover:bg-[#CA4EE5]">Submit</Button>
        </form>
      )}

      {showThankYou && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
          <p className="text-xl">We appreciate your interest. We&apos;ll follow up with you soon.</p>
        </div>
      )}
    </div>
  )
}
