import { PresentationSection } from "../components/PresentationSection"
import { PromCard } from "../components/PromCard"
import { PromsSection } from "../components/PromsSection"

export default function HomePage() {
    return (
        <main>
            <PresentationSection />
            <PromsSection>
                <PromCard />
                <PromCard />
                <PromCard />
            </PromsSection>
        </main>
    )
}

