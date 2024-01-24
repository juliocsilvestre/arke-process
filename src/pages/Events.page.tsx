import { PlusIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateEvent } from "@/api/mutations/events.mutation";
import { Button } from "@components/ui/Button";
import { Calendar } from "@components/ui/Calendar";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@components/ui/Form";
import { Input } from "@components/ui/Input";
import { Label } from "@components/ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/Popover";
import { SlideOver, SlideOverFooter } from "@components/ui/Slideover";
import { NAVIGATION } from "@utils/constants";
import { cn } from "@utils/styles";

import { indexEventsQueryOption } from "@/api/queries/events.query";
import { DataTable } from "@/components/ui/DataTable";
import { useQuery } from "@tanstack/react-query";
import { CreateEventBody, CreateEventSchema, eventsColumns } from "./Events.defs";

export const EventsPage = (): JSX.Element => {
    const { latestLocation } = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<CreateEventBody>({
        resolver: zodResolver(CreateEventSchema),
        defaultValues: {
            name: "",
            dates: {
                from: undefined,
                to: undefined,
            },
        },
    });

    const { mutateAsync: createEvent } = useCreateEvent();
    const { data: events } = useQuery(indexEventsQueryOption);

    const navigate = useNavigate();

    const onCreateEvent = async (values: CreateEventBody): Promise<void> => {
        try {
            await createEvent(values);
            form.reset();
            handleOnClose();
            toast.success(
                <p>
                    O evento <strong>{values.name}</strong> foi criado com sucesso!
                </p>
            );
        } catch (error: unknown) {
            if (!(error instanceof AxiosError)) return;
            console.error(error.response?.data.errors);

            // biome-ignore lint/correctness/noUnsafeOptionalChaining: <explanation>
            for (const e of error.response?.data.errors) {
                form.setError(e.field, { message: e.message });
                toast.error(
                    <p>
                        Alguma coisa deu errado com o campo <strong>{e.field}</strong>:{" "}
                        <strong>{e.message}</strong>
                    </p>
                );
            }
        }
    };

    const handleOnClose = () => {
        setIsOpen(false);
        form.reset();
    };
    const disabledDays = [{ before: new Date() }];

    return (
        <section className="bg-gray-50 min-h-screen overflow-y-auto p-4 md:p-10">
            <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between">
                <h1 className="text-4xl text-primary font-bold">
                    {NAVIGATION.find((n) => n.href === latestLocation.pathname)?.name ?? ""}
                </h1>
                <Button
                    variant="default"
                    size="sm"
                    className="mt-4"
                    onClick={() => setIsOpen(true)}
                >
                    <PlusIcon className="h-6 w-6" aria-hidden="true" />
                    Novo evento
                </Button>
            </div>

            <section className="mt-[30px]">
                <DataTable
                    columns={eventsColumns}
                    data={events?.data.events.data ?? []}
                    count={events?.data.events_count}
                    onQueryChange={(query) => console.log(query)}
                    onRowClick={({ id }) =>
                        navigate({
                            to: "/dashboard/eventos/$id",
                            params: { id },
                        })
                    }
                />
            </section>

            <SlideOver
                title="Novo evento"
                subtitle="Preencha os campos abaixo para criar um novo evento."
                isOpen={isOpen}
                close={handleOnClose}
            >
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onCreateEvent)}
                        className="h-full flex flex-col gap-2 justify-between"
                    >
                        <div className="px-5 py-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="name" label="Nome" isrequired />
                                        <FormControl>
                                            <Input
                                                id="name"
                                                placeholder="Insira o nome do evento"
                                                {...field}
                                                size="lg"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dates"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="dates" label="Dias do evento" isrequired />
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant="outline"
                                                    className={cn(
                                                        "w-[300px] justify-start text-left font-normal !border-slate-200 text-gray-600 hover:bg-white hover:text-gray-600 focus-visible:!border-primary-700",
                                                        !field.value?.from &&
                                                            !field.value?.to &&
                                                            "!opacity-50"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value?.from ? (
                                                        field.value.to ? (
                                                            <>
                                                                {format(
                                                                    field.value.from,
                                                                    "LLL dd, y"
                                                                )}{" "}
                                                                -{" "}
                                                                {format(
                                                                    field.value.to,
                                                                    "LLL dd, y"
                                                                )}
                                                            </>
                                                        ) : (
                                                            format(field.value.from, "LLL dd, y")
                                                        )
                                                    ) : (
                                                        <span>Escolha uma data</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 " align="start">
                                                <Calendar
                                                    locale={ptBR}
                                                    initialFocus
                                                    mode="range"
                                                    defaultMonth={field.value?.from}
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    numberOfMonths={1}
                                                    disabled={disabledDays}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <SlideOverFooter>
                            <div className="flex flex-shrink-0 justify-end px-4 py-4 bg-white gap-2">
                                <Button type="button" variant="outline" onClick={handleOnClose}>
                                    Cancelar
                                </Button>
                                <Button variant="default" type="submit">
                                    Criar evento
                                </Button>
                            </div>
                        </SlideOverFooter>
                    </form>
                </Form>
            </SlideOver>
        </section>
    );
};
