import { Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/card"

type Props = {
    name?: string,
    email?: string,
    telephones?: {
        number: string;
        area_code: string;
    }[];
    children?: React.ReactNode

}


export function CardCredential({ name, email, telephones, children }: Props) {
   return (
    <Card className="glow-effect group relative w-full max-w-sm overflow-hidden bg-gradient-to-br from-purple-500/60 via-gray-300 to-white shadow-2xl transition-all will-change-transform duration-300 hover:shadow-2xl hover:shadow-purple-500/50 md:hover:scale-105 border border-purple-500/30">
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      
      <div className="relative px-8 py-10">
        
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg">
            <span className="text-xl font-bold text-white">{name?.trim().split(" ").slice(0,2).map(word => word.charAt(0).toUpperCase()).join("")}</span>
          </div>
        </div>

      
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest font-bold text-purple-600/70 mb-2">Nome</p>
          <h3 className="text-3xl font-bold text-black text-balance leading-tight">{name}</h3>
        </div>

       
        <div className="mb-8 h-px bg-gradient-to-r from-purple-500/0 via-purple-900/40 to-purple-500/0" />

       
        <div className="space-y-5">
          
          <div className="flex items-start gap-4">
            <Mail className="h-5 w-5 text-purple-600/60 flex-shrink-0 mt-1" />
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest font-bold text-purple-600/70 mb-1">E-mail</p>
              <p className="text-sm font-medium text-black text-blackbreak-all">{email}</p>
            </div>
          </div>

          
          <div className="flex items-start gap-4">
            <Phone className="h-5 w-5 text-purple-600/60 flex-shrink-0 mt-1" />
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-purple-600/70 mb-1">Telefone</p>
              <p className="text-sm font-medium text-black">
                { telephones?.map((phone, index) => (
                  <span key={index}>
                    ({phone.area_code}) {phone.number}{index < telephones.length - 1 ? ', ' : ''}
                    </span>
                )) }
              </p>
            </div>
          </div>
        </div>

        
        <div className="mt-8 pt-6 border-t border-purple-500/20">
          <p className="text-xs text-purple-900/70 text-center">Sistema de Credenciais</p>
        </div>
      </div>
    </Card>
  )
}