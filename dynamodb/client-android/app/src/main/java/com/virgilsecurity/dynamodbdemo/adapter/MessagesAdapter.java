package com.virgilsecurity.dynamodbdemo.adapter;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.virgilsecurity.dynamodbdemo.R;
import com.virgilsecurity.dynamodbdemo.client.model.Message;
import com.virgilsecurity.dynamodbdemo.utils.MessageStorage;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class MessagesAdapter extends RecyclerView.Adapter<MessagesAdapter.ViewHolder> {

    private static final String TAG = "MessagesAdapter";

    private DateFormat mDateFormat = new SimpleDateFormat("HH:mm:ss");
    private MessageStorage mMessages;

    class ViewHolder extends RecyclerView.ViewHolder {

        public TextView mAuthorTextView;
        public TextView mDateTextView;
        public TextView mMessageTextView;

        public ViewHolder(RelativeLayout layout) {
            super(layout);
        }
    }

    public MessagesAdapter(MessageStorage messages) {
        mMessages = messages;
    }

    public MessagesAdapter
            .ViewHolder onCreateViewHolder(ViewGroup parent,
                                           int viewType) {

        LayoutInflater inflater = LayoutInflater.from(parent.getContext());
        RelativeLayout layout = (RelativeLayout) inflater.inflate(R.layout.chat_message, parent, false);

        ViewHolder viewHolder = new ViewHolder(layout);
        viewHolder.mAuthorTextView = (TextView) layout.findViewById(R.id.author);
        viewHolder.mDateTextView = (TextView) layout.findViewById(R.id.date);
        viewHolder.mMessageTextView = (TextView) layout.findViewById(R.id.message);

        return viewHolder;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Message message = mMessages.get(position);

        holder.mAuthorTextView.setText(message.getAuthor());
        holder.mDateTextView.setText(mDateFormat.format(new Date(message.getDateCreated())));
        holder.mMessageTextView.setText(message.getBody());
    }

    @Override
    public int getItemCount() {
        return mMessages.size();
    }

    public void setMessageStorage(MessageStorage storage) {
        this.mMessages = storage;
    }
}
