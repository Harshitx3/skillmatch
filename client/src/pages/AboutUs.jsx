export default function AboutUs() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                About Us
            </h1>

            <div className="space-y-8 text-gray-300">
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
                    <p className="leading-relaxed">
                        DevLink is a platform designed to connect developers with similar skills and interests.
                        We believe that great collaborations start with meaningful connections, and our mission
                        is to make finding the perfect coding partner easier than ever.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">What We Do</h2>
                    <p className="leading-relaxed mb-4">
                        Our platform allows developers to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Create detailed profiles showcasing their skills and experience</li>
                        <li>Swipe through potential matches based on shared interests</li>
                        <li>Connect with developers for collaboration on projects</li>
                        <li>Build a network of like-minded professionals</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">Our Story</h2>
                    <p className="leading-relaxed">
                        Founded by a group of passionate developers, DevLink was born from the need to find
                        reliable collaborators for side projects. We understand the challenges of finding
                        the right person to work with, and we're here to solve that problem.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">Join Us</h2>
                    <p className="leading-relaxed">
                        Whether you're looking for a partner for your next startup, someone to learn with,
                        or just want to expand your professional network, DevLink is the place for you.
                    </p>
                </section>
            </div>
        </div>
    );
}
